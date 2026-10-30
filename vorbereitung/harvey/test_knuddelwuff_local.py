"""Tests for the local Knuddelwuff patches (German opt-outs, pet OSM tags, config)."""
import pytest
from pydantic import ValidationError

from harvey.agents.handler import _opt_out_reason
from harvey.collectors.discover import OpenStreetMap
from harvey.config import ComplianceConfig, DEFAULT_OPT_OUT_LINE, load_config


# --- German opt-out detection ---------------------------------------------

@pytest.mark.parametrize("reply", [
    "Bitte abmelden.",
    "nein danke",
    "Nein danke",
    "Kein Interesse.",
    "Bitte keine Werbung mehr.",
    "Bitte keine weiteren E-Mails.",
    "Bitte nicht mehr kontaktieren.",
    "Bitte austragen, danke.",
])
def test_german_opt_outs_are_detected(reply):
    assert _opt_out_reason(reply, reply) is not None


@pytest.mark.parametrize("reply", [
    "Klingt interessant, rufen Sie gern an.",
    "Wir haben großes Interesse, schicken Sie Infos.",
    "Danke für die Nachricht, wann passt es Ihnen?",
])
def test_german_positive_replies_are_not_opt_outs(reply):
    assert _opt_out_reason(reply, reply) is None


@pytest.mark.parametrize("reply", ["unsubscribe", "No thanks", "STOP", "remove me"])
def test_english_opt_outs_still_detected(reply):
    assert _opt_out_reason(reply, reply) is not None


# --- Config / opt-out line regex -------------------------------------------

def test_german_opt_out_line_accepted():
    line = 'Kein Interesse? Antworten Sie einfach mit "nein danke", dann schreibe ich nicht wieder.'
    assert ComplianceConfig(opt_out_line=line).opt_out_line == line


def test_german_line_without_reply_word_rejected():
    with pytest.raises(ValidationError):
        ComplianceConfig(opt_out_line="Kein Interesse? Dann melden Sie sich einfach.")


def test_default_english_opt_out_line_still_valid():
    assert ComplianceConfig(opt_out_line=DEFAULT_OPT_OUT_LINE).opt_out_line


def test_opt_out_line_with_link_still_rejected():
    with pytest.raises(ValidationError):
        ComplianceConfig(opt_out_line='Antworten Sie mit "nein danke" oder https://example.com')


# --- OSM pet categories ----------------------------------------------------

@pytest.mark.parametrize("term,tags", [
    ("Hundesalon", ["shop=pet_grooming"]),
    ("Hundefriseur", ["shop=pet_grooming"]),
    ("Zoofachgeschäft", ["shop=pet"]),
    ("Tierbedarf", ["shop=pet"]),
    ("Hundepension", ["amenity=animal_boarding"]),
    ("Hundetagesstätte", ["amenity=animal_boarding"]),
    ("Hundeschule", ["amenity=animal_training"]),
    ("Hundetrainer", ["amenity=animal_training"]),
])
def test_pet_terms_map_to_osm_tags(term, tags):
    assert OpenStreetMap()._tags(term) == tags


def test_unknown_term_still_has_no_catch_all():
    assert OpenStreetMap()._tags("Steuerberater") == []


def test_existing_us_trades_unchanged():
    assert OpenStreetMap()._tags("roofing contractor") == ["craft=roofer", "shop=roofing"]


# --- Knuddelwuff local config ----------------------------------------------

def test_knuddelwuff_local_config_loads_with_safe_settings():
    cfg = load_config("harvey.local.yaml")
    email = cfg.channels.email
    assert email.require_approval is True
    assert email.max_daily_sends == 10
    assert email.send_to_risky is False
    assert cfg.channels.linkedin.enabled is False
    assert cfg.compliance.precleared.enabled is False
