# AC appJsonVersionManager
***CZ:***
Toto je jednoduché rozšíření pro Visual Studio Code, které umožňuje zvedání verze v souboru `app.json`.

## Popis funkcionality

1. **aktualizace z gitu:**
    - provede příkaz `git checkout [main_branch]`.
        - `[main_branch]` je název hlavní větve, lze nastavit v settings.json (výchozí hodnota je `main`).
    - pokud tento příkaz selže, provede se ještě dodatečný příkaz `git stash`.
    - Provede pull z větve `[main_branch]`, aby získalo nejnovější změny.
    - spustí příkaz `git checkout -`.
    - v případě, že předtím musely být nějaké změny stashnuty, provede ještě příkaz `git stash pop`
    - Sloučí změny z `[main_branch]` zpět do původní větve.

2. **Zvedne verzi v souboru `app.json`:**
   - Rozšíření najde a aktualizuje hodnotu elementu `version` v souboru `app.json`.

## Jak Používat

1. Spusťte příkaz "Package & increase version to latest" ze seznamu příkazů nebo pomocí klávesové zkratky (lze nastavit v paletě příkazů).

2. Po dokončení operací se verze v souboru `app.json` aktualizuje.

**DŮLEŽITÉ:** Pro správné fungování rozšíření musí být otevřený aspoň jeden editor.

## Konfigurace

V souboru `settings.json` je možné nastavit některé hodnoty pro správné fungování rozšíření:
1. **název hlavní větve v repozitáři:**
    - dostupné pod klíčem `ac-appjsonversionmanager.mainBranchName`
    - výchozí hodnota je `main`
2. **formát předposledního čísla verze:**
    - dostupné pod klíčem `ac-appjsonversionmanager.versionFormat`
    - výchozí hodnota je `"yymmdd"` (podle potřeb v Intergramu)
    - povolené hodnoty:
        - `"yymmdd"` - `[poslední 2 číslice roku (23)][měsíc][den]`
        - `"yyyymmdd"` - použije se celý rok (2023)
        - `"autoIncrement"` - číslo se zvedne o 1 nezávisle na předchozí hodnotě
    - poslední číslo verze se **vždy** zvedne o 1

## Připomínky a Kontakt

Pokud máte nějaké připomínky (hlavně asi k formátu verze), otázky nebo návrhy na vylepšení tohoto rozšíření, sem s nimi! Níže je seznam způsobů, jak mi dát vědět:

- **GitHub Issues:**
  - Přidávejte otázky nebo připomínky do [Issues na GitHubu](https://github.com/panSlota/appJsonVersionManager/issues).

***
***EN:***

This is a simple extension for Visual Studio Code, which allows the user to increase the version in `app.json` file.

## Description

1. **synchronizing from git:**
    - executes a `git checkout [main_branch]` command
        - `[main_branch]` is the name of the default branch in the repository, can be modified in `settings.json` (default value: "main")
    - if this command fails, an additional `git stash` command is executed
    - pulls the latest changes from the default branch
    - executes a `git checkout -` command
    - in case of the `git stash` command being executed, an additional command `git stash pop` is executed
    - merges the changes from the default branch back to the original one

2. **increasing the version in `app.json`:**
   - the process finds the `version` element in `app.json` & updates it according to the configuration

## Usage

1. Execute the command "Package & increase version to latest" from the command palette. An additional keybind can be configured in the command palette.

2. The version should be successfully updated.

**IMPORTANT:** At least one editor pane must be opened for this extension to work properly.

## Configuration

Some values can be configured in `settings.json` for correct extension behavior:
1. **default branch name in repo:**
    - accessible by key `ac-appjsonversionmanager.mainBranchName`
    - the default value is `main`
2. **second-to-last version number format:**
    - accessible by key `ac-appjsonversionmanager.versionFormat`
    - default value is `"yymmdd"`
    - allowed values:
        - `"yymmdd"` - `[the last 2 digits of the year (23)][month][day]`
        - `"yyyymmdd"` - all 4 digits are utilized (2023)
        - `"autoIncrement"` - the number is increased by 1 regardless of its previous value
    - the last version number is **always** incremented by 1

## Suggestions & Contact

If you have any suggestions (mainly regarding the version format), questions or improvement ideas, feel free to let me know. You can find the contact options below:

- **GitHub Issues:**
  - Add questions or suggestions here: [Issues on GitHub](https://github.com/panSlota/appJsonVersionManager/issues).