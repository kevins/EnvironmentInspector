# Changes

## 2.0.0 (November 2026)

Unmanaged Layer Scanner is now Environment Inspector, with two new tools: *Compare environments* and *Compare data*.

**Renamed to Environment Inspector**

* **Unmanaged Layer Scanner is now Environment Inspector**, because it does more than find unmanaged layers. The
  window's title bar and the install page say *Environment Inspector*, and no message says "the scanner" any more.
  The tabs *Unmanaged layers* and *Compare environments* keep their names.
* **The favourite is named Environment Inspector** on the install page (it was *Unmanaged layers*). A favourite made
  with an earlier version keeps running that version until you replace it; when you replace its URL, rename it too
  (see *Update to a new version* in the README).
* **The files have new names**: `Install-Environment-Inspector.html`, `environment-inspector.bookmarklet.txt`,
  `environment-inspector.min.js`, `EnvironmentInspector-Technical-Reference.docx` and
  `EnvironmentInspector-Developer-Guide.docx`. In the repository, the code is `environment-inspector.js` and the
  install page `Install Environment Inspector.html`.
* **Environment rules are read from `inspector.settings.json`** (it was `scanner.settings.json`; the example is
  `inspector.settings.example.json`). A build that finds only `scanner.settings.json` stops and asks you to rename it,
  so it never builds without your rules.
* **Saved selections and other choices carry over**, as the earlier version kept them in this browser: the last choice
  of each environment, the column widths and the window's place and size.
* **Snapshots saved before the rename still open.** One saved now can't be opened by the earlier version.

**Compare data (new)**

* **A third tool, *Compare data*, compares the records of the tables you choose** between two environments, for
  example the reference data a configuration depends on (countries, currencies, codes, rates). **Save snapshot** reads
  the chosen tables and downloads `data-snapshot-<org>-<time>.jsonl.gz`; in the other environment, open that file under
  *Compare with*, then **Compare**. **Compare again** repeats the last comparison.
* **Any table can be chosen**, except private and many-to-many ones (the list shows the tables Advanced Find offers;
  **Show every table** adds the others). Each shows its records here, as Dataverse counted them, and in the snapshot
  opened; a table Dataverse gives no count of (virtual and elastic tables, or every table in an environment that keeps
  no counts) says *not counted yet*, and is counted when it is ticked. A large one says so plainly: *Large* over 50,000
  records, *Very large* over 1,000,000, *Too large* over 5,000,000 (it can't be ticked). **Compare** and **Save
  snapshot** ask first when a table is *Very large* or has more than 50,000 records of unknown number, when reading is
  estimated at 5 minutes or more, and on the maker portal when its sign-in may end before the read does. One comparison
  holds at most 5,000,000 records, a data snapshot 25,000,000 (and 20 GB, in 2,000 tables at most).
* **Records are matched the way you choose, table by table** (a table's settings): *Automatic* (the same id first, then
  the table's alternate key when it has only one, or else its name, used only where exactly one record on each side has
  the value: never a guess; with a key, a record whose key isn't filled by its name), *Id only*, a key, the name, or up
  to three columns you choose; an elastic table's records by their id and partition. The two environments' root business
  units, and their default teams, are always one pair, and as each is named after its environment, their names aren't
  compared. Letter case and spaces at the ends don't count when matching, and a lookup in a key is matched as it is
  compared.
* **Values are compared by type**: text exactly; big whole numbers, decimals and currency amounts by their digits (1.50
  is 1.5); floating point numbers at their precision; dates by their behaviour (the day, or to the second); choices by
  their number, several choices as a set. A lookup to a table in the comparison goes through that table's matching;
  users, teams, business units, queues and calendars are compared by name (the root business unit and its default team
  are the same on both sides), currencies by their code, the organization never, any other table by record id or by name
  (a setting of each table). Every difference counts, and one that is hard to see says what it is: only letter case,
  spaces at the ends, line breaks, another kind of space, invisible characters or how accented letters are stored; no
  value against 0, No or a choice's option 0 (by its label); the same label under another number. Amounts and decimal
  numbers are shown with their digits grouped, at their precision (*300,000.00 CAD*).
* **You choose the columns.** A table's settings show its columns in three groups: compared; left out unless you tick
  them (what Dataverse sets itself or sets per environment, such as Created on and Owner; calculated and rollup columns;
  copies in the base currency; secured columns; file columns, compared by their file name); and never compared. The
  Currency table's own exchange rate is compared. Columns whose name suggests a secret (secret, password, token,
  credential, apikey, privatekey, connectionstring and the like, in every tab), images, and file and attachment content
  are never read; a Power Pages site setting's value that may hold a secret is kept as its fingerprint.
* **Records you may not see are never reported missing.** When your security role reads only some records of a table,
  or the role of whoever saved the snapshot did, a record that role may not have seen is *Couldn't compare*, not
  *Only in* the other environment, and a note says so.
* **The results: how many records differ in each table, then the records, then one record side by side.** The
  overview answers first (*53 records differ in 6 of 10 tables*). The two environments head their own lanes: this
  environment and when it was read, the snapshot and when it was saved, and how many tables and records each gave in
  full. Each table has its records in each environment side by side, how many are only on one side under them, and the
  answer in words: *34 records differ* with one line of kinds (*28 different, in Rate and Valid to*), or *No
  differences*. The tables that differ come first, the most first, then those without differences, then those not
  compared, each with its reason in its row (select the row for the whole reason). Records that couldn't be compared
  are counted at the top of the list and in their rows, never hidden behind *No differences*. *Find a table* searches
  the list, and *Good to know* is one folded line at the end, its first note what was compared and how long it took.
* **A table's records, one line each, with Open in both environments.** Each line has its status, the record's name
  and match value, what differs in words (*Population: 0 in Dev, no value in Test*, *Capital and Notes differ*, *Name:
  only letter case differs*), and an **Open** link in each environment's lane, to the record's form there. Tabs choose
  *All differences*, *Different*, *Only in Dev*, *Only in Test* or *Couldn't compare*, each with its count; the
  *Columns that differ* chips, each with how many records differ in it, keep the records that differ in one column;
  *Find a record* searches them. The records that are the same are one line at the end (*30 records are the same ·
  Show them*). A line above the list says how the records were matched (*matched by their id, then Code · 19 columns
  compared*; its tooltip, how many each way). Two lines with the same name and match value show the start of their
  record id, so they can be told apart. The records are listed by status, then by name (past 100,000, by status in the order read, and a
  line says so), up to 500,000 lines, and only the lines on screen are drawn.
* **A record, side by side.** The columns that differ come first, each with its two values in their lanes, what
  differs marked (spaces, line breaks and invisible characters shown), and a note under the pair when the difference
  is hard to see; a long text's lines are kept level on both sides, with the lines one side alone has tinted in its
  colour. **Open in Contoso Dev** and **Open in Contoso Test** sit over their own lanes. Then the columns that couldn't
  be compared, *Show the 16 columns that are the same*, and *About this record* (when it last changed, its id in each
  environment, how it was matched). **Copy** shows on a value when it is pointed at or focused. The *JSON* tab shows
  both records as compared and as stored. **Previous** and **Next** (Alt+Up, Alt+Down) go through the list it was opened
  from.
* **Tables open while the comparison goes on.** Each table's row says where it is (*Waiting*, *Reading the snapshot*,
  *Reading here: 640 of about 1,204 records*, *Comparing…*), then its result; a table that is compared can be opened at
  once, and its records too, while the others are read. **Stop**, the memory guard and the end of the run keep the open
  table or record on screen; Export waits for the end.
* **Very large tables are counted, not kept**: when the chosen tables are too large to keep whole in the tab, the
  largest are compared as they are read (and so is a table whose size isn't known); every record is compared and
  counted, the first 50,000 that differ are listed, and lookups from or to them are compared by record id or by name,
  not through a table's matching. A memory guard stops a run before the tab runs out of memory. A long run goes on with
  the window closed (a small pill shows how far it is) and asks before the page is left; **Stop** keeps the tables
  already compared (stopping **Save snapshot** saves nothing).
* **Exports**: from the overview, every difference, one line per value (CSV); from a table's records, the records as the
  tab, the column chip and the search leave them, with both values of each column that differs (**Excel (CSV)**), with
  every compared column (**Excel (CSV), every compared column**), or every record of the table, the same ones too
  (**Excel (CSV), every record**); the whole comparison (JSON); and a data snapshot of this environment as read for the
  comparison (not after a table was counted). They are made one at a time, in slices, so the window keeps answering:
  one asked for while another is being made follows it, never dropped ("Another export is being made: this one follows
  when it is done."), and holds what the page showed when it was asked for.
* **When a data snapshot couldn't read some tables**, its message says so in one sentence ("3 tables couldn't be
  read."), with each table's full reason in a fold right under it (**Why**, or **Why, for each**: the table's name in
  bold, the reason, Dataverse's own message on its own lines), the rest of the message under a line.
* **Saved selections** of tables, each with its settings, as in the other tabs. The last choice is remembered for each
  environment, and opening a data snapshot takes the choice it was saved with.
* **Read-only, and careful with files.** Every request is a read. A data snapshot holds the values of the records you
  chose, personal data too when the tables hold it (the tool says to keep it as you keep exports of your data), and
  never a sign-in token, a column whose name suggests a secret (such as a password), an image or file content. A file is
  checked line by line and value by value, shown as text, and refused when it isn't a data snapshot, ends early, holds
  more than its first line says, or is over 4 GB packed or 20 GB unpacked. Each comparison tab recognizes the other's
  snapshot file and offers **Open it there**.

**Compare environments (new)**

* **A second tool, *Compare environments*, compares two environments**: the components of the solutions you choose,
  managed or unmanaged, with a snapshot file saved in the other environment. **Save snapshot** reads the chosen
  solutions and downloads `snapshot-<org>-<time>.json.gz`; in the other environment, **Compare** with that file.
  *Unmanaged changes* (on by default) also compares every component changed in either environment itself (an
  unmanaged layer) or created there (an unmanaged component), outside the chosen solutions too. **Compare again**
  repeats the last comparison.
* **An overview first, the versions side by side.** The two environments head their own lanes (this environment and
  when it was read; the snapshot, when it was saved and how old it is), and the title answers first (*4 solutions and
  10 components differ*). Their Dataverse versions and languages come first, joined by = or ≠. Then the compared
  solutions, newest install first: each one's version in each lane (the newer one marked *Newer*, *Not installed* in a
  dashed box), *Managed* or *Unmanaged* and when it was installed, its unmanaged layers on top there or its latest
  patch, joined by = (the same version and patch) or ≠, and the answer in words: *4 components differ* with one line
  of kinds (*2 different, 1 only in Test, 1 layer differs*), *Not installed in Contoso Dev*, *No differences*. With
  *Unmanaged changes*, the unmanaged changes outside the solutions are one more row, with how many each environment
  has. Then the components of these solutions: *All components*, with how many each environment has and how many
  differ, and *Unmanaged layer on top*, with how many have one in each environment (*2 components have one · All in
  Contoso Test*). A solution differs when it is missing on one side, at another version or patch, or when one of
  its components differs, and the title counts the compared solutions and their components. *Good to know* notes say
  what isn't compared, and why. Each row opens its list.
* **One name for each status, and an icon of its own shape**: *Different* (an orange disc with a not-equal sign);
  *Only in Dev* or *Only in Test* (known to be missing in the other: a ring in that environment's colour, filled on its
  side); *Unmanaged only in Dev* (a disc in this environment's colour, with a pencil: an unmanaged change in this
  environment, in none of the compared solutions, that the snapshot has none of; whether the other environment has
  the component from another solution can't be told); *Layers differ* (a teal disc with layers: the same definition,
  with an unmanaged layer or another solution on top in one environment, or held by different solutions in the two
  environments); *Couldn't compare* (a grey dashed ring with a question mark: it couldn't be read, or couldn't be
  matched for certain; counted on its own, with its own tab, not as a difference); and *Same* (a green disc with a
  check; also when only values set per environment differ). The word is always shown or read with the icon. Each line
  of a list says the rest in words: *Layout differs*, *On in Dev, off in Test*, *Only the layer on top differs*, *In
  Contoso Fixes in Dev only*.
* **Unmanaged layers in each environment, everywhere.** Under each solution's version, how many of its components have
  an unmanaged layer on top there; the overview's *Unmanaged layer on top* row, whose counts open those components; a
  Filter in the lists (*In either*, *In Dev*, *In Test*, *Only in Dev*, *Only in Test*, *In both*, *None*); a teal tag
  with a pencil on the lines (*Unmanaged layer in Test*, *Unmanaged layer in both*); and in the details, the layer on
  top marked *Unmanaged layer* ("over" its managed solution), with a note. They are shown whether or not the other
  environment has the same change. One rule holds on every screen and in every export: an unmanaged layer is the
  Active layer on top of a managed component, also one changed through an unmanaged solution; a component made in an
  environment (unmanaged there, in an unmanaged solution such as one developed there, or in none) is an unmanaged
  component (*Unmanaged: made in Dev*, also in the CSV's *On top in* column; *Contoso Dev has it as an unmanaged
  component (made there)* on a *Layers differ* line), never counted as an unmanaged layer. With a snapshot saved by an
  earlier version, which doesn't say whether a component is managed, one that a solution developed there holds counts
  as made there.
* **Every installed solution, and every layer.** Below the compared solutions, the overview lists every other solution
  installed in either environment (a patch shows with its solution), with its version in each, how many of the
  compared components it holds, and how many of those it holds a layer of in one environment only. Under its heading,
  *Other solutions* says how many of yours differ (*3 of 4 differ*); Microsoft's solutions that differ, and the
  solutions that are the same, are folded, and one that holds compared components opens their list. A compared
  component that a managed solution you didn't choose holds in one environment only is *Layers differ* (*In Contoso
  Fixes in Dev only*), so a layer from any solution shows. The details name every solution that holds the component in
  each environment, lined up side by side, with a dashed *Not in Test* where only one does.
* **Then a list of components, by type.** Each row of the overview opens its own list: a compared solution's
  components, *All components*, the unmanaged changes outside the solutions, those with an unmanaged layer on top, or
  the compared components another solution holds. A solution's list starts with its version in each environment and
  its unmanaged layers on top, side by side (the two versions and the connector between them level at every width;
  the solution's unique name and publisher, and how each version is installed, wrap between their parts in a narrow
  window, never leaving a "·" at the start or end of a line). Tabs choose *All differences*, *Different*, *Only in
  Dev*, *Only in Test*, *Layers differ*, *Couldn't compare* (and *Unmanaged only in Dev* in the unmanaged changes'
  list), each with its count; they keep their places (one with nothing in it is greyed), and those that don't fit go
  under **More**. **Filter** chooses the type and the unmanaged layer on top (each choice a chip that removes it), and
  *Find a component* searches. The components are grouped under their types, in the maker portal's order: each line
  has its status, its name with its table or schema name (and its solutions, in a list that spans solutions), what
  differs in words (the verb as the property's name says one thing or several: *Runs as differs*, *Privileges
  differ*; *Columns (JSON) and columns differ*), the
  teal tag when an unmanaged layer is on top, and a **Layers** link to its solution layers page in each environment's
  lane. The ones that are the same are one line at the end (*2 components are the same · Show them*). Large groups are
  folded, and a long one shows 100 lines, then **Show more**.
* **Then a component, side by side.** *Where it is* first: the solutions that hold it in each environment, with their
  versions, and the layer on top, joined by =, ≠ or the teal layers sign, with a teal note when an unmanaged layer is
  on top; **Solution layers in Dev** and **Solution layers in Test** sit over their own lanes; a side without the
  component says why in a dashed box. Then the properties that differ, each with its two values in their lanes (not red
  and green: neither environment is the older one); property names in words first, from the names Microsoft's table
  reference gives the columns of forms, views, processes, web resources and plug-in steps, and a name of its own in
  each kind of component where one column means something else in another (*Layout* `formxml`, *Table*
  `objecttypecode`, a form's *Form type* `type`, a view's *Status* `statecode`, a process's *On or off* `statecode`, a
  plug-in step's *Execution mode* `mode`), two forms of one thing named apart (*Columns* `layoutxml` and *Columns
  (JSON)* `layoutjson`; *Definition* `definition`, *Definition (client data)* `clientdata` and *Definition (XAML)*
  `xaml`), both names whole in the name's tooltip; some values in words, the stored number in the tooltip, also for a
  component in one environment only (the state of a process or plug-in step, such as *On* or *Enabled*; a form's, a
  view's, a process's, a web resource's and a plug-in step's documented choices, such as *Main form*, *Public*,
  *Real-time*, *Script (JScript)* or *Post-operation*; any component's language by name, *English*); a view's type
  with Microsoft's capitals in its header, the list's groups, **Filter** and the CSV (*Advanced Find view*, *Quick
  Find view*); a display label as its text (*Customer tier*, or each language's); a long
  value's lines are kept level on both sides, nested XML indented level by level, three unchanged lines around each change and
  the rest folded (*24 unchanged lines*), numbered, long lines wrapped; the line differences of the first three
  properties are open, the others one click away (*Show the differences*). The properties that are the same, and the
  values set per environment (*1 value is set per environment, so it isn't counted*), are folded. A component in one
  environment only shows its definition there, property by property. When the same solution and version are on top in
  both, with no unmanaged layer, and the definitions still differ, a note says how that happens (another solution's
  layer underneath, for the types that combine their layers: forms, site maps, apps and choices; the same version
  imported again with other content; something set once, when the component was first made in each environment). The
  Layers tab reads this environment's layers and links to all of them in the other; the JSON tab shows its definition in
  either environment, as compared and as stored. **Previous** and **Next** (Alt+Up, Alt+Down) go through the list it
  was opened from.
* **Each environment keeps its colour, its side and its name everywhere** (a short one where room is tight: *Dev* and
  *Test* for Contoso Dev and Contoso Test). **Swap**, the round button between the two lane heads of every sheet,
  exchanges the two sides in the whole window and in both comparison tabs, keeps the place and the focus, says which
  environment is now on the left, and is remembered.
* **Matching that holds up in real environments.** Newer component types, which each environment numbers itself, are
  matched by their table's name. A component with no name of its own is named from its table's primary name column, or
  by a short text of its own. Components Dataverse makes in each environment with ids of their own are matched by what
  they are: table mappings by their two tables, column mappings by their tables and columns, plug-in steps by their
  plug-in type, message, table, stage, mode, rank, name and filtering columns (a real-time workflow's steps also by
  the workflow behind them), step images by their step, an app's settings by their app and the setting they set; the
  links between matched components are compared through those pairs. A global choice's layer on top is read from its
  layers (one request each), and a choice column that uses a global choice compared too has its options compared
  once, on the choice. Duplicate detection rules and their conditions, which component lists can name by newer type
  numbers, are compared once each, under their classic types.
* **Only real differences count.** Left out: what Dataverse sets or works out itself (dates, version numbers, owners,
  calculated and rollup columns), the type codes of custom tables, the case of ids, the order of keys in JSON and the
  spaces between XML tags, labels in a language only one environment has (a label missing in a language both have
  counts), properties only one environment's Dataverse version has (inside JSON held in text, such as a flow's
  definition, every key counts), a managed property's *can be changed* setting, and a value one environment never set
  where the other holds its default (no value, a blank, false and 0 count as the same). Values that differ by design
  (environment variable values, connections, an agent's publishing state, the activation behind a real-time workflow's
  step) are marked set per environment and listed under **Same**. A solution developed in one environment (unmanaged)
  and installed in the other (managed) at the same version is not a difference, nor a layer difference for its
  components; an unmanaged layer over the installed solution is one. A solution at another version shows on its own
  row, not as a layer difference on each of its components. A column Dataverse lists but doesn't return is named
  under *Good to know*, not as a failure; what couldn't be read is named for each environment.
* **Fast, without reading every layer.** Each component's definition and the solution of its top layer are read in
  bulk; layers are read only for a component's details. In a test environment, a solution of 115 components took 5 to
  9 seconds, and about 19,600 components (with *Unmanaged changes*) 32 to 47 seconds.
* **Read-only, and careful with files.** Every request is a read. A snapshot holds configuration, never a token,
  password, key or secure configuration (a column whose name suggests a secret is never read). A file is checked field
  by field when it is opened, shown as text, and refused when it isn't a snapshot or is over 500 MB, packed or
  unpacked (one that large isn't saved either); its links are built only from checked ids and a Dataverse address.
* **Exports**: from a list, its lines as the tab, Filter and search leave them, folded ones too, and the same ones
  while *Show them* is open (**Excel (CSV)**), or every component of the list, the same ones too (**Excel (CSV), every
  component**); from the overview, every component that isn't the same (CSV: each row's status, what differs and its
  solutions, then in each environment the layer on top, every solution that holds it, the id and the link to its
  solution layers page); the whole comparison (JSON); and a snapshot of this environment as read for the comparison.
  The overview's CSV and the JSON list their rows in the overview's order: the solutions as the overview lists them,
  then the components by type and name.
* **Saved selections** of solutions and options, as in *Unmanaged layers*, kept apart from that tab's.

**Unmanaged layers**

* **A new option, *Managed layers on top*, finds the components of the chosen solutions whose layer another managed
  solution covers.** Dataverse keeps the layer of the solution installed later on top, and importing the earlier one
  again, even as an upgrade, does not move it up, so the later solution's version is the one in effect. With the
  option on, the scan also reads the chosen solutions' component lists and the solution of each component's top
  layer, and lists a candidate only once its layers confirm it (up to 1,000 per scan; an amber banner counts any
  others). Microsoft's solutions are not looked under (Microsoft layers its solutions on each other by design); a
  banner names the chosen ones left out.
* When both kinds are found, the results have two lists, **Unmanaged** and **Managed on top**, and the title counts
  both. A managed layer on top shows *Overridden by &lt;solution&gt;*, cannot be ticked or deleted, and its details
  open on the covered solution's layer against the layer on top, under a note on what to do for the component to work
  as the covered solution sets it. In the Layers tab the layer on top is marked *Managed, on top*, and **Compare with top layer**
  compares any other layer with it.
* The option is kept in saved selections and remembered with the last choice. The CSV export ends with a *Layer on
  top* column, and the JSON export has `managed` and, for each managed layer on top, `onTop` and `holderUniques`.
* In a short window, *Limit to tables* and the new option keep only their title and control (with tables chosen, one
  line says how many, with **Check all tables**), so the object types keep room.
* Fixed: in a narrow Layers tab, a layer's date and time can now go on two lines, each kept whole; before, they stayed
  on one line.
* Fixed: a changed duplicate detection rule, or a condition of one, was listed twice.
* A view's type has Microsoft's capitals in the Type column and its filters, as in the comparisons: *Advanced Find
  view*, *Quick Find view* (they read *Advanced find view* and *Quick find view*).
* **Scans are about three times as fast.** The solution summary and the definitions of tables, columns and keys are
  now asked for at the start, and Dataverse prepares them while the queries per component type run; before, the scan
  asked for each after those queries and waited, up to 10 seconds each with nothing changing on the screen. The scan
  also sends up to 8 requests at once instead of 4, reads the layers of 6 components at a time instead of 3 (Dataverse
  allows 52 requests at once per user), and reads the solution memberships and the parts of *Managed layers on top* 8
  at a time instead of one after the other. In a test environment with 520 managed solutions, a full scan took 10 to
  16 seconds instead of 26 to 47, and one solution 5 to 8 seconds instead of 15 to 25, with the same requests and the
  same results. With *Managed layers on top*, a test that also looked under a large Microsoft solution (4,151
  candidates) took 41 to 48 seconds instead of 98.
* **A scan of your own solutions reads only those solutions**: their component lists, then what they hold, instead of
  every component type of the environment. In a test environment, one solution took about 2 seconds and 51 requests
  instead of 5 to 9 seconds and 330, with the same results. With one of Microsoft's solutions chosen, such as System,
  the scan still reads the whole environment: some of their components are in no component list.
* **A long wait says why.** While Dataverse asks Environment Inspector to slow down, or while a step waits for a
  request that has to be sent again, the step line says so, with when the scan goes on in the time's place ("Dataverse
  is busy (HTTP 503)… 58% · trying again in 4 s"); in a narrow window the text gives way, never the countdown. The
  steps that wait say what they wait for: the table definitions count their requests ("Reading the definitions of
  tables and columns (4 of 10)…"), and *Managed layers on top* names the part it is still reading.
* **The look of the comparisons' results.** The results have the comparisons' page header: the scope line above the
  title (*Unmanaged layers · 4 managed solutions · All object types · Scanned in 8.1 s*), and in a narrow window the
  buttons keep only their icons. The list, its columns, filters, sorting, banners and deleting are as before, with the
  new colours and marks: a teal pencil on **Unmanaged** and a teal layers disc on **Managed on top**; a managed layer on
  top has a teal outline layers mark in the tick column, where it can't be ticked; *Overridden by* is teal; *Layers
  could not be read* and the *Not checked* banner carry the grey dashed question mark; a deleted row has the green
  check disc; **Stop scan** has its stop icon; the *Managed on top* list has no header tick box. Red is kept for
  deleting and errors: in every tab, a failure shows a red disc and a finished task a green check disc, in its message,
  its toast and the corner pill (after deleting: *Deleting finished*, *Deleting finished with problems* with a red disc,
  or *Deleting stopped*).
* **A component's details, side by side, with Back.** The details have the same page header: **Back** ("Back to all
  unmanaged layers (Alt+Left)"), *All unmanaged layers* above the title, the title with its teal tag (*Unmanaged
  layer* or *Managed layer on top*; none for a component deleted in this session), **Previous** and **Next** (Alt+Up,
  Alt+Down), **Solution layers** and **Delete unmanaged layer**. *What changed* shows the two chosen layers as two lanes
  (teal for the layer the row is about, grey for another managed layer), each lane head with its layer's place from
  the bottom (*Layer 2 of 3*) and, when the component has more than two layers, a list to choose another; **Swap**
  exchanges them ("The Active layer is now on the left"), and the pager says where it is ("13 of 20, Information").
  The properties that differ come first (*2 properties differ*): a long value's lines are kept level, with three
  unchanged lines around each change and the rest folded, numbered, long lines wrapped; XML is laid out level by level,
  an element with several attributes one per line and its `>` or `/>` on its own line, so an added attribute is one
  added line. Properties are named in words, as the comparisons name them in that kind of component, with Dataverse's
  name under each and both whole in the name's tooltip (*Layout changes (managed)* `formxmlmanaged`, *Name in each
  language*, a form's *Form type* `type`), a label in each language shows as text (*English (1033): … · French (1036):
  …*), and a long value only one layer has shows each line at its own indent, a line too long for its box hanging its
  wrapped rows 2 characters further in and breaking at a space, before a dot or after an opening bracket or a comma
  where it can. The properties that
  are the same, and the system values that also differ (such as Modified on), are folded. The Layers tab marks the
  unmanaged layer and a managed layer on top with teal tags, and the JSON tab uses neutral colours. Alt+Left, or the
  mouse's back button, goes back to the list as it was left; Esc closes the list of layers first, then the details.

**Window**

* The choice screen's heading is three tabs, *Unmanaged layers*, *Compare environments* and *Compare data*. Each keeps
  its own choices and saved selections.
* **The choice screens take the results' header**: the tab's description on its first line, the three tabs where the
  results' title is, and **Saved selections** where the results' last button is, so going from choosing to the results
  moves nothing. Their layout, controls and texts are as before. In *Compare data*'s chosen tables, a table your
  security role can read only in part, or not at all, carries the grey dashed question mark, and *Some records only* is
  a grey tag. In a very narrow window the tabs get smaller and the solutions' search stays inside its card.
* **The results of both comparisons** have the same three levels: an overview (which tables or solutions differ, and
  how much), a list (which records or components differ, and in what), and one record or component side by side, with
  links to it in both environments. Each page gives the answer first, in words (*34 records differ*), then what kind.
  The two environments are two lanes all the way down: each sheet starts with them as column heads (a bar in each
  one's colour, its name, what it is), with **Swap** between them, and each one's values sit in its lane, joined by =
  or ≠ (an orange ≠ always means a difference; two counts are joined by a plain line). Each status has its own colour,
  its own shape and always its word: *Couldn't compare* is a grey dashed ring with a question mark, so it can't be
  taken for *Different*'s orange; anything about layers is teal; red is kept for deleting and errors. **Back**, with
  its word, sits at the left of every title below an overview, in the same place on every level, and names where it
  goes ("Back to Country (Alt+Left)"): one level up, so one press from a list, or two from a record or component, reach
  the main results page, and *Where you are* above the title (*All tables › Country ›*) jumps to a level above in one
  click. **Alt+Left** and the mouse's back button do what Back does; **Esc** clears a search or closes a menu, else goes
  up one level (on an overview it closes the window, or shrinks it to the pill while a data comparison runs). Going
  back shows the page as you left it (the same tab, filter, search, folds and scroll, the focus on the line you came
  from), without reading anything again. Nothing moves: the header is 76 px on every level, Back keeps its place, rows
  have one height from the first moment, and the end of a run only regroups the rows once. The pages fit from 720 to
  1440 px wide: at 1,000 px and less the header's buttons keep only their icons (Back keeps its word), and at 800 px
  and less a row takes two lines. Screen readers hear each row as a sentence, each status as a word and the lane heads
  as column headers; Windows contrast themes keep every shape, draw the lane heads' dots in the theme's text colour and
  show the keyboard's focus everywhere; a menu item, and a title reached from the keyboard, show a focus ring. With
  reduced motion, spinners stand still and nothing slides.
* **Alt+Left, Alt+Right and the mouse's back and forward buttons belong to the window**, wherever it is (the choice
  screens, the scan and its dialogs included), so they never send the Dataverse page underneath back or forward, which
  would leave the page the window is on; where there is no level to go up, they only close an open menu.
* In the details of all three tabs, two values are compared **side by side**, each in its lane, and a property is
  named in words first when it has a plain name, then by Dataverse's name (*Layout* `formxml`). Two long values are
  lined up line by line also when more than about 1,000 lines changed (before, past 2,000 changed lines, the whole old
  value, then the whole new one); two stretches with no line in common are counted at any size (*1,500 lines differ*),
  and a part that still can't be lined up is shown one side's lines, then the other's, and says so with that part's
  lines on each side (*12 lines differ; a part with too many changes isn't lined up (…)*, or *Too many changes to line
  them up (…)* when no line of the value is lined up).
* **The lane heads** of both comparisons say a snapshot's age the same way on every page (*Snapshot · 1 day old*, *Data
  snapshot · less than a day old*; when it was saved is on the overview and in a component's or record's lane-head
  tooltip), and a name or line too long for its lane wraps instead of being cut, both colour bars level. The overviews
  never wrap: in a narrower window they cut a long name or line with "…" (*Saved Sep 30, 2025 at 8:42 a.m.*), and
  each lane head's tooltip holds the name and its lines whole, then the address and the snapshot file's name; on
  *Compare data*, the third line comes last, with what it counts. A screen reader hears a lane head's name and lines
  once, then only what its tooltip adds.
* The step line shows the time since a scan or comparison started (m:ss, counted every second to its end), so a slow
  answer no longer looks like a stalled run; a run over a minute gives its time in minutes and seconds
  (*Scanned in 1 min 5 s*).

**Building**

* The build gives the minifier its own short names, one character or with a digit second (`a0`, `b7`), so no name the
  minifier makes up can spell a word by chance. They make the link about 1,400 characters longer than terser's own
  names would (about 297,700 characters in all).

## 1.0.0 (October 2026, released as Unmanaged Layer Scanner)

The first public release. Compared with the last private build, it includes the fixes from an independent code review.

**Scanning**

* **Stop always stops.** Stop now ends the reads that are waiting or in progress at once, instead of waiting for a slow
  or stalled answer, and a scan started right after a stop no longer waits for the reads of the one before.
* **A read that gets no full answer within 5 minutes ends** (it is not sent again, so a heavy query does not load the
  server twice). Before, a stalled answer could leave the window in "Stopping…" until the page was reloaded.
* **Components flagged only by the solution summary are confirmed before they are listed.** The summary also flags a
  table when only one of its parts is customized. Their layers are now read first, up to 1,000 of them, whatever the
  details setting, and the ones without an unmanaged layer of their own are dropped. Before, past the first 500
  findings, such a table could be listed although it had no unmanaged layer.
* **Incomplete scans say so in more cases.** A component with an unmanaged layer that is in no solution's component
  list and whose layers cannot be read (or more than 1,000 such components), and a summary-only component whose layers
  cannot be read, now mark the scan INCOMPLETE and are named in the details, instead of only a note.
* The banner about details not read yet counts the components whose details were read, and says when some of the
  others were flagged only by the solution summary. "Read N more" reads those first.
* **Column and table image configurations are skipped without a note** when Dataverse refuses them with its own
  security error (0x80040256). In some environments it refuses them that way even to System Administrators who hold
  the privileges it names, so the "Not checked" note named them in every scan. A role that really lacks those
  privileges is still told, any other type your role cannot read is still named, and the image configurations are
  still checked wherever Dataverse allows it.

**The details and the comparison of layers**

* **The Layers tab shows when the unmanaged layer was last changed, and by whom.** Dataverse gives an unmanaged layer
  no overwrite time, so its row showed a dash. It now shows the component's last save (*Last changed*) and, for
  most components (views, charts, processes, web resources, templates, environment variables, roles and others), the user who saved it (*Last changed by &lt;name&gt;*), or for a form its last publish
  (*Last published*), taken from the layer's own data. Forms, tables, columns and relationships record no user, and
  relationships no date.
* **The Layers tab fits narrow windows.** It no longer scrolls sideways: headers, dates and links wrap where they read
  well, long names end with "…", and in a narrow window Publisher and Version go under the solution's name.
* **The comparison is lossless.** XML is laid out by changing only the spacing between elements: text, mixed content,
  `xml:space="preserve"`, single spaces between elements and the XML declaration are kept, and XML with a DOCTYPE is
  shown as stored. JSON is indented without being parsed again, so large numbers and the order of keys stay exact.
* **Numbers are kept as written.** Every number in layer data that JavaScript cannot hold exactly as written (a whole
  number above 2^53, as in a relationship's cascade mask; a long fraction; an exponent such as `1e2`; or `1.0`) keeps
  its digits, so it is shown, copied and compared exactly. A number and a text with the same digits are told apart:
  when two values differ only in type, both are shown as JSON, so the text has its quotes.
* Two different values that would look the same once laid out are shown as stored, with a note, so the difference is
  always visible. A difference in line endings alone is named, and carriage returns are shown.
* **Copy copies the value as stored** (web resource content decoded), not the laid-out text, so it can be pasted back
  exactly.
* **Every compared value has Copy.** Short values (one line, up to 200 characters) have a "Copy" link at the end of
  each layer's row.
* **Web resources whose content Dataverse keeps as a file.** A layer's data then holds `contentfileref`, a reference
  to that layer's own file, instead of `content`, and the Web API gives out only the file in effect now. The layers
  of one web resource can hold the content in different ways: in tests, right after a save through the Web API, the
  Active layer held the content itself and the managed layer only a file reference. The content is now one row,
  `content`, whichever way each layer holds it. The details read the web resource's current content once when they
  open, and the top layer, when its file is the one in effect, gets that content. When both layers' content can be read, it is
  compared like any other value (decoded, XML types laid out, images shown, with Copy), and the same content held in
  different ways is *Same*. When a layer's file is any other, its content can't be read: the row says which layer's
  content can't be read and why, shows the other layer's content with Copy, and nothing is guessed or compared line by
  line. When neither layer's content can be read, it says so.
* "1 line differs" instead of "1 line differ".

**Deleting**

* **The check after each removal compares what the managed layers define**: their solution, order and publisher, and
  the values each one sets (values Dataverse keeps up to date itself, such as the overwrite time, are left out). When
  the unmanaged layer is gone but a managed layer's values changed at the same time (another import, for example), the
  row says "Result unknown" with the reason, instead of "Deleted". A relationship in that case is no longer reported as
  "Partly deleted".
* **The deletion log holds a web resource's content also when Dataverse keeps it as a file.** Right before the
  removal, the web resource's current content is read (one extra read per such component). When its file is the
  unmanaged layer's, the log entry holds it as `content` (base64, as Dataverse stores it); otherwise the entry has
  `contentNote`: "the content of the unmanaged layer could not be read before the removal". When the unmanaged layer
  holds the content itself, its changes already contain it.

**Building and settings**

* No environment names are built in any more. Development environments (where deleting is turned off) and production
  environments (named in red in the delete confirmation) can be named in an optional local `scanner.settings.json`,
  read at build time and never published. See `scanner.settings.example.json` and the README.
* **The settings are checked.** `scanner.settings.json` must be a JSON object, and a setting name other than
  `developmentEnvironments` and `productionEnvironments` stops the build ("scanner.settings.json: unknown setting ...
  The settings are: developmentEnvironments, productionEnvironments."), so a misspelled name can no longer leave
  deleting allowed in a development environment. The build prints the rules it applied ("Built with your environment
  rules from scanner.settings.json (developmentEnvironments /.../i): for your organization only, do not publish this
  build."), and a file without rules prints "scanner.settings.json names no environment: built without environment
  rules."
* **`package-lock.json` is published** (terser 5.51.2 and its dependencies, 11 packages), so `npm ci` works and
  installs exactly what built the release. Use it for release builds.
* The version is shown in the window's title tooltip and on the install page, from `package.json`.
* The PowerShell version for pipelines was removed; the bookmarklet is the only tool.

## Before the public release

The scanner was built and used privately before 1.0.0. What those builds added, newest first:

### Column widths

* Columns can be resized by dragging their header edges; a double-click or **Fit to contents** fits a column to its
  values; widths are remembered; **Reset column widths**.
* **What changed** shows as many property names as fit in the column, then +N.

### Type bubbles and layer pickers

* The type bubbles came back (with a **More (n)** menu for those that do not fit), as the Type column's filter.
* The layer pickers in the comparison never offer the same layer on both sides; **Swap**.
* The object types card comes before the tables card.
* Deleting follows the order shown, top to bottom; the confirmation lists the components in that order.

### Tables, filters and details

* **Limit to tables**: check only the components of the tables you choose.
* Every column of the results filters and sorts like Excel (values with counts, search, Select all).
* **Details** for each component: compare any two layers property by property (XML and JSON laid out, web resource
  content decoded, images shown, side by side or inline), the list of layers, and each layer's Changes, All properties
  and Children.
* The window can be moved, resized and maximized, and remembers its place.
* A component type the user's security role cannot read is named in a note ("Not checked") instead of making the scan
  incomplete.

### One confirmation and a new design

* Deleting needs one confirmation, as **Remove active customizations** in the maker portal, with the checks before and
  after each component kept.
* A row's link opens the component's solution layers in the managed solution it was found in.
* The window was redesigned (Fluent 2), with no layout jumps while loading.

### The maker portal, object types and saved selections

* Runs on the environment's Solutions pages in the maker portal (make.powerapps.com), with the portal's own sign-in.
* Choose object types (for example only forms and views).
* Saved selections.
* A click on a row opens the component's solution layers page; the type tags filter the results.

### Choosing the managed solutions

* Choose the managed solutions to check before the scan; each result names its managed solution.
* Solution membership is read by id for the components found, so the cost follows the number of findings.

### The first builds

* The scan: one query per component type for managed components whose top layer is unmanaged, the solution summary
  for the types the sweep cannot read, and the layers of each finding.
* Deleting with checks before and after each component.
