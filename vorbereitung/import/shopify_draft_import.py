#!/usr/bin/env python3
"""Legt die Produkte aus produkte-warmako-rukka.json als ENTWURF (DRAFT) in Shopify an.

Standard ist ein Probelauf ohne Schreibzugriff. Erst mit --apply wird geschrieben.
Zugangsdaten nur über Umgebungsvariablen, nie im Repository:
  SHOPIFY_SHOP           z. B. zcrydz-s0.myshopify.com
  SHOPIFY_CLIENT_ID      Client-ID der App „Claude Einrichtung“
  SHOPIFY_CLIENT_SECRET  Client-Secret (nach Abschluss rotieren)

Sicherungen:
  - status ist fest DRAFT; das Skript veröffentlicht nichts (keine publishablePublish-Aufrufe).
  - Ein Produkt mit gleichem Handle wird nicht doppelt angelegt.
  - Nach dem Anlegen wird jeder Status erneut gelesen; alles außer DRAFT bricht ab.
"""
import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

API_VERSION = "2026-10"
DATA = Path(__file__).with_name("produkte-warmako-rukka.json")
METAFIELD_KEYS = {"material", "pflege", "groessentabelle", "warnhinweise", "hersteller", "eu_verantwortlicher"}


def build_input(p):
    """ProductSetInput für einen Datensatz (Status immer DRAFT)."""
    option_values = {}
    for v in p["variants"]:
        for name, value in zip(p["options"], v["options"]):
            option_values.setdefault(name, [])
            if value not in option_values[name]:
                option_values[name].append(value)
    variants = []
    for v in p["variants"]:
        inv = {"sku": "WM-" + v["supplier_sku"], "tracked": False}
        if v.get("grams"):
            inv["measurement"] = {"weight": {"value": float(v["grams"]), "unit": "GRAMS"}}
        variants.append({
            "optionValues": [{"optionName": n, "name": val} for n, val in zip(p["options"], v["options"])],
            "price": p["uvp"],
            "barcode": v["barcode"],
            "inventoryPolicy": "DENY",
            "inventoryItem": inv,
        })
    metafields = [
        {"namespace": "custom", "key": k, "type": "multi_line_text_field", "value": val}
        for k, val in p["metafields"].items() if val
    ]
    return {
        "handle": p["handle"],
        "title": p["title"],
        "descriptionHtml": p["description_html"],
        "vendor": p["vendor"],
        "productType": p["product_type"],
        "status": "DRAFT",
        "tags": p["tags"],
        "productOptions": [{"name": n, "values": [{"name": x} for x in vals]} for n, vals in option_values.items()],
        "variants": variants,
        "metafields": metafields,
    }


def write_csv(products, path):
    """Shopify-Produkt-CSV (klassisches Spaltenformat) für den manuellen Import im Admin."""
    import csv
    labels = {"material": "Material", "pflege": "Pflegehinweise", "groessentabelle": "Größentabelle"}
    cols = ["Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
            "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
            "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Policy",
            "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping", "Variant Taxable",
            "Variant Barcode", "Variant Weight Unit", "Status"]
    cols += [f"{labels[k]} (product.metafields.custom.{k})" for k in labels]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for p in products:
            for i, v in enumerate(p["variants"]):
                row = {"Handle": p["handle"], "Variant SKU": "WM-" + v["supplier_sku"],
                       "Variant Grams": v.get("grams") or "", "Variant Inventory Tracker": "",
                       "Variant Inventory Policy": "deny", "Variant Fulfillment Service": "manual",
                       "Variant Price": p["uvp"], "Variant Requires Shipping": "TRUE",
                       "Variant Taxable": "TRUE", "Variant Barcode": v["barcode"], "Variant Weight Unit": "g"}
                for n, (name, value) in enumerate(zip(p["options"], v["options"]), start=1):
                    row[f"Option{n} Value"] = value
                    if i == 0:
                        row[f"Option{n} Name"] = name
                if i == 0:
                    row.update({"Title": p["title"], "Body (HTML)": p["description_html"], "Vendor": p["vendor"],
                                "Type": p["product_type"], "Tags": ", ".join(p["tags"]),
                                "Published": "FALSE", "Status": "draft"})
                    for k in labels:
                        row[f"{labels[k]} (product.metafields.custom.{k})"] = p["metafields"].get(k, "")
                w.writerow(row)


def validate(products):
    errors = []
    for p in products:
        inp = build_input(p)
        if inp["status"] != "DRAFT":
            errors.append(f"{p['handle']}: Status nicht DRAFT")
        if not inp["variants"]:
            errors.append(f"{p['handle']}: keine Varianten")
        combos = [tuple(o["name"] for o in v["optionValues"]) for v in inp["variants"]]
        if len(combos) != len(set(combos)):
            errors.append(f"{p['handle']}: doppelte Variantenkombination")
        for v in inp["variants"]:
            if not (v["barcode"].isdigit() and len(v["barcode"]) == 13):
                errors.append(f"{p['handle']}: EAN ungültig {v['barcode']}")
        for word in ("bewertung", "sterne", "lieferzeit", "zertifi", "heilt", "medizin"):
            if word in inp["descriptionHtml"].lower():
                errors.append(f"{p['handle']}: verbotener Begriff „{word}“ in Beschreibung")
        if not {m["key"] for m in inp["metafields"]} <= METAFIELD_KEYS:
            errors.append(f"{p['handle']}: unbekanntes Metafeld")
    return errors


class Shopify:
    def __init__(self, shop, client_id, secret):
        self.shop = shop
        body = json.dumps({"client_id": client_id, "client_secret": secret,
                           "grant_type": "client_credentials"}).encode()
        req = urllib.request.Request(f"https://{shop}/admin/oauth/access_token", data=body,
                                     headers={"Content-Type": "application/json"})
        self.token = json.load(urllib.request.urlopen(req, timeout=30))["access_token"]

    def gql(self, query, variables=None):
        req = urllib.request.Request(
            f"https://{self.shop}/admin/api/{API_VERSION}/graphql.json",
            data=json.dumps({"query": query, "variables": variables or {}}).encode(),
            headers={"Content-Type": "application/json", "X-Shopify-Access-Token": self.token})
        res = json.load(urllib.request.urlopen(req, timeout=60))
        if res.get("errors"):
            raise RuntimeError(res["errors"])
        return res["data"]


FIND = "query($q:String!){products(first:1,query:$q){nodes{id handle status}}}"
CREATE = """mutation($input:ProductSetInput!){productSet(synchronous:true,input:$input){
  product{id handle status totalVariants}
  userErrors{field message code}}}"""
CHECK = """query($id:ID!){product(id:$id){id handle status title totalVariants tags
  variants(first:50){nodes{sku barcode price selectedOptions{name value}}}
  metafields(first:10,namespace:"custom"){nodes{key value}}}}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="wirklich in Shopify anlegen")
    ap.add_argument("--csv", help="zusätzlich Shopify-CSV für den manuellen Import schreiben")
    args = ap.parse_args()

    products = json.loads(DATA.read_text())["products"]
    errors = validate(products)
    for p in products:
        inp = build_input(p)
        print(f"{inp['handle']}: {len(inp['variants'])} Varianten, Status {inp['status']}, "
              f"Metafelder {[m['key'] for m in inp['metafields']]}")
    if errors:
        print("FEHLER:", *errors, sep="\n  ")
        sys.exit(1)
    if args.csv:
        write_csv(products, args.csv)
        print(f"CSV geschrieben: {args.csv}")
    if not args.apply:
        print("Probelauf ok – nichts geschrieben (mit --apply anlegen).")
        return

    missing = [k for k in ("SHOPIFY_SHOP", "SHOPIFY_CLIENT_ID", "SHOPIFY_CLIENT_SECRET") if not os.environ.get(k)]
    if missing:
        sys.exit("Zugangsdaten fehlen: " + ", ".join(missing))
    shop = Shopify(os.environ["SHOPIFY_SHOP"], os.environ["SHOPIFY_CLIENT_ID"], os.environ["SHOPIFY_CLIENT_SECRET"])

    results = []
    for p in products:
        found = shop.gql(FIND, {"q": f"handle:{p['handle']}"})["products"]["nodes"]
        if found:
            print(f"übersprungen (existiert): {p['handle']} {found[0]['id']} {found[0]['status']}")
            pid = found[0]["id"]
        else:
            out = shop.gql(CREATE, {"input": build_input(p)})["productSet"]
            if out["userErrors"]:
                sys.exit(f"{p['handle']}: {out['userErrors']}")
            pid = out["product"]["id"]
            print(f"angelegt: {p['handle']} {pid}")
        check = shop.gql(CHECK, {"id": pid})["product"]
        if check["status"] != "DRAFT":
            sys.exit(f"ABBRUCH: {p['handle']} hat Status {check['status']}")
        results.append(check)
    Path(__file__).with_name("import-ergebnis.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print("Alle Produkte geprüft: Status DRAFT.")


if __name__ == "__main__":
    main()
