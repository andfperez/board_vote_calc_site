# Updating the Board Voting Scenario Calculator

These instructions explain how to update the IFC voting powers, update the dates shown in the app, test the changes, and publish the new version.

## Project structure

The main files are:

- `index.html`: page structure and voting-power dates
- `data.js`: ED office names, vote totals, and voting-power percentages
- `app.js`: calculations, dropdown behavior, reset function, and local storage
- `styles.css`: visual design
- `update_instructions.md`: these instructions

The project uses two GitHub repositories:

- `origin`: private development repository
- `public`: public repository used by GitHub Pages

Both repositories use the `main` branch.

The live website is:

https://andfperez.github.io/board_vote_calc_site/

---

# 1. Download or open the latest voting-power PDF

Use the official IFC Executive Directors voting-power table:

https://thedocs.worldbank.org/en/doc/acff11167280c724a8f7d9158164919a-0330032021/original/IFCEDsVotingTable.pdf

Confirm that the PDF is the most recent version.

At the bottom of the PDF, record both dates:

- `Data as of`
- `Reporting on`

These dates must be updated in the app whenever the voting-power data is updated.

---

# 2. Review the PDF carefully

The PDF contains:

- the current Executive Director name, or `VACANT`
- the number of votes
- the percentage of total voting power
- the countries in each constituency

Important limitations:

1. The PDF numbers the entries from 1 through 25 according to their order in the PDF. These numbers are not the EDS office designations.
2. Do not use the PDF row number to determine the EDS office number.
3. Some rows use this format:

   `COUNTRY (NAME)`

   Other rows use:

   `NAME (COUNTRY)`
4. The PDF does not identify the Alternate Executive Director.
5. When the PDF says `VACANT`, keep the correct EDS office number and use the Alternate Executive Director's surname in the app.
6. The voting powers should come from the latest PDF, even if the World Bank office webpage has older figures.

---

# 3. Confirm the correct EDS office mapping

The EDS office webpages provide the correct mapping between office numbers and constituencies.

The pages follow this pattern:

https://www.worldbank.org/en/about/leadership/directors/eds01

Change the final part for each office:

- `eds01`
- `eds02`
- ...
- `eds25`

Use these pages to verify:

- the correct EDS office number
- the Executive Director
- the Alternate Executive Director
- the constituency associated with the office

Do not reorder the app according to the alphabetical order of the PDF. The app must remain ordered from `EDS01` through `EDS25`.

If the PDF lists an occupied ED position, use the surname of the current Executive Director.

If the PDF lists the position as `VACANT`, use the surname of the current Alternate Executive Director.

---

# 4. Update `data.js`

Open `data.js`.

Each constituency uses this structure:

```javascript
{
  id: "EDS01",
  name: "Moghtader",
  votes: 4348954,
  votingPower: 17.07,
},
```

For each of the 25 offices, update the following fields as needed:

* `name`
* `votes`
* `votingPower`

Do not change the `id` unless the EDS office mapping itself has been confirmed to have changed.

For a vacant ED position represented by the Alternate, use:

```JavaScript
{
  id: "EDS05",
  name: "Maluck",
  votes: 1269367,
  votingPower: 4.98,
  representedByAlternate: true,
},
```

If the position is no longer vacant, remove this line:

```JavaScript
representedByAlternate: true,
```

Use numbers without commas in JavaScript.

Correct:

```JavaScript
votes: 4348954,
```

Incorrect:

```JavaScript
votes: 4,348,954,
```

Voting power should be entered as a number, not as text.

Correct:

```JavaScript
votingPower: 17.07,
```

Incorrect:

```JavaScript
votingPower: "17.07%",
```

# 5. Update the voting-power dates

Open `index.html`.

Find the voting-power date line. It should resemble:

```HTML
<p class="data-date">
  Voting power:
  <strong>As of June 30, 2026</strong>
  •
  Reported July 9, 2026
</p>
```

Replace the two dates with the dates shown at the bottom of the latest PDF:

Data as of becomes As of
Reporting on becomes Reported

Example:

```HTML
<p class="data-date">
  Voting power:
  <strong>As of July 14, 2026</strong>
  •
  Reported July 16, 2026
</p>
```

**Do not change the surrounding HTML**

# 6. Save and test the app locally

Save all edited files.

Open `index.html` in the browser, or refresh the browser if it is already open.

Because the app saves selections in the browser, click Reset before testing the updated totals.

Confirm the following:

1. There are exactly 25 rows.
2. The rows run from EDS01 through EDS25.
3. Each office shows the correct surname.
4. Vacant ED positions show the Alternate ED surname.
5. Each voting-power figure matches the PDF.
6. The voting-power dates match the bottom of the PDF.
7. The initial Support total is approximately 100.00%.
8. Changing a row to Comments changes its color but continues to count as Support.
9. Changing a row to Abstain reduces Support and increases Abstain by the correct amount.
10. Changing a row to Object reduces Support and increases Object by the correct amount.
11. The Reset button returns every row to Support.
12. Refreshing the page preserves the current selections.

Small rounding differences may occur if the published percentages do not add to exactly 100.00%. Investigate any difference larger than approximately 0.02 percentage points.

# 7. Review the changes in VS Code

Open Source Control in VS Code.

Review every changed file before committing.

The normal update should usually change only:

`data.js`
`index.html`

Do not commit unrelated files or temporary copies of the PDF.

In the terminal, check the changes with:

```Shell
git status
```

Optional detailed review:

```Shell
git diff
```

# 8. Commit the update to the private repository

Stage the changed files:

```Shell
git add data.js index.html
```

If another legitimate project file was changed, add it separately.

Create a descriptive commit:

```Shell
git commit -m "Update voting powers and reporting dates"
```

Push the commit to the private development repository:

```Shell
git push origin main
```

# 9. Publish the update to the public GitHub Pages repository

After the private push succeeds, publish the same commit to the public repository:

```Shell
git push public main
```

This updates the public repository from which GitHub Pages is deployed.

**Do not** edit the public repository directly. All development and edits should happen in the private repository.

# 10. Confirm deployment

GitHub Pages normally updates within approximately one to five minutes.

Open the live website:

https://andfperez.github.io/board_vote_calc_site/

Refresh the page.

A forced refresh may be needed if the browser shows the previous version:

Chrome on Mac: `Command + Shift + R`
Safari on Mac: `Option + Command + R`

Confirm:

1. The new dates appear.
2. The updated names and voting powers appear.
3. The calculations still work.
4. Reset still works.
5. The page looks correct on both desktop and phone.

The app's saved voting selections are stored separately on each device. Updating the website does not synchronize or preserve a scenario across different devices.

# 11. Check the Git remotes if publishing fails

Run:

```Shell
git remote -v
```

The output should contain two remotes:

`origin`

`public`

origin should point to the private development repository.

public should point to the public GitHub Pages repository.

If the public remote is missing, add it again:

```Shell
git remote add public https://github.com/andfperez/board_vote_calc_site.git
```

Then retry:

```Shell
git push public main
```

# 12. Standard update command sequence

After editing and testing, the normal command sequence is:

```Shell
git status
git diff
git add data.js index.html
git commit -m "Update voting powers and reporting dates"
git push origin main
git push public main
```

Then verify the live website.

# Update checklist

Use this shorter checklist for routine updates:

* [ ] Open the latest official IFC voting-power PDF.
* [ ] Record Data as of.
* [ ] Record Reporting on.
* [ ] Match every PDF constituency to the correct EDS office.
* [ ] Update ED surnames in data.js.
* [ ] Replace VACANT with the current Alternate ED surname.
* [ ] Update votes in data.js.
* [ ] Update voting-power percentages in data.js.
* [ ] Update both dates in index.html.
* [ ] Save all files.
* [ ] Open the app locally.
* [ ] Click Reset.
* [ ] Confirm there are 25 offices.
* [ ] Confirm voting powers total approximately 100%.
* [ ] Test Comments, Abstain, Object, and Reset.
* [ ] Run git status.
* [ ] Run git diff.
* [ ] Commit the changes.
* [ ] Push to origin main.
* [ ] Push to public main.
* [ ] Wait for GitHub Pages deployment.
* [ ] Verify the live website on desktop and phone.

# Troubleshooting

## The live page still shows the old data

Wait several minutes and force-refresh the browser.

Check the public repository to confirm that the latest commit appears there.

You can also check the repository's Actions tab to confirm that the Pages deployment completed successfully.

## Everything up-to-date appears unexpectedly

Run:

`git status`

The changes may not have been saved or committed.

Check the latest commits:

`git log --oneline -5`

## The Support total is not close to 100%

Check for:

* a missing office
* a duplicated office
* an incorrectly copied percentage
* a percentage entered as text
* a misplaced decimal point
* a mismatch between the PDF row and the EDS office

## An ED position is listed as vacant

Use the appropriate EDS office webpage to identify the current Alternate Executive Director.

Display the Alternate's surname in data.js and include:

```JavaScript
representedByAlternate: true,
```

## The app opens with an old voting scenario

Click Reset.

This is caused by local browser storage and does not mean that the published data failed to update.

# Changes to this instructions file:

**Do not publish it to the public site repository**, since it is internal maintenance documentation rather than part of the app. Your normal update workflow can therefore use the lines before, and Do not run `git push public main` for this documentation-only commit unless you are comfortable with the Markdown file being publicly accessible in the deployment repository.

```zsh
git add update_instructions.md
git commit -m "Add voting power update instructions"
git push origin main
```
