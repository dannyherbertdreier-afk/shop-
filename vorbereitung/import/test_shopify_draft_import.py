"""Tests ohne Netzwerk: python3 test_shopify_draft_import.py"""
import json
import os
import sys
import unittest
from unittest import mock

sys.path.insert(0, os.path.dirname(__file__))
import shopify_draft_import as imp

PRODUCTS = json.loads(imp.DATA.read_text())["products"]


class FakeShop:
    def __init__(self, status="DRAFT", existing=()):
        self.status, self.existing, self.created = status, set(existing), []

    def gql(self, query, variables=None):
        if query is imp.FIND:
            h = variables["q"].split(":", 1)[1]
            return {"products": {"nodes": [{"id": "gid://x/" + h, "handle": h, "status": "DRAFT"}] if h in self.existing else []}}
        if query is imp.CREATE:
            self.created.append(variables["input"])
            return {"productSet": {"product": {"id": "gid://x/" + variables["input"]["handle"]}, "userErrors": []}}
        return {"product": {"id": variables["id"], "status": self.status}}


class Tests(unittest.TestCase):
    def test_five_products_valid(self):
        self.assertEqual(len(PRODUCTS), 5)
        self.assertEqual(imp.validate(PRODUCTS), [])

    def test_all_draft_and_one_vendor(self):
        for p in PRODUCTS:
            self.assertEqual(imp.build_input(p)["status"], "DRAFT")
            self.assertEqual(p["supplier"]["name"], "Warmako B.V.")

    def run_main(self, shop):
        with mock.patch.object(imp, "Shopify", return_value=shop), \
             mock.patch.dict(os.environ, {"SHOPIFY_SHOP": "s", "SHOPIFY_CLIENT_ID": "i", "SHOPIFY_CLIENT_SECRET": "x"}), \
             mock.patch.object(sys, "argv", ["x", "--apply"]), \
             mock.patch.object(imp.Path, "write_text"):
            imp.main()

    def test_apply_creates_five_drafts(self):
        shop = FakeShop()
        self.run_main(shop)
        self.assertEqual(len(shop.created), 5)

    def test_existing_not_duplicated(self):
        shop = FakeShop(existing={PRODUCTS[0]["handle"]})
        self.run_main(shop)
        self.assertEqual(len(shop.created), 4)

    def test_non_draft_aborts(self):
        with self.assertRaises(SystemExit):
            self.run_main(FakeShop(status="ACTIVE"))


if __name__ == "__main__":
    unittest.main()
