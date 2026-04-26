DM_SPL_ZIP_FILES_META_DATA.txt is a pipe (|) delimited mapping Set ID and zip filename to drug names. It contains several columns describing the metadata of each SPL.

The first row of this file is the column header and all other rows are data elements. For each SPL zip file name, there will be one and only entry in this file.

 Column        | Description
-------------------------------------------------------------------------
 SETID         | Uniquely identifies a group of versions of an SPL file.*
 ZIP_FILE_NAME | Filename of the zip file containing the SPL.
 UPLOAD_DATE   | Date that the current active version was uploaded.
 SPL_VERSION   | Current active version number of the SPL.
 TITLE         | Title of the drug in the format "DRUG NAME [LABELER NAME]".

*For more information about Set ID, please visit http://www.fda.gov/downloads/ForIndustry/DataStandards/StructuredProductLabeling/UCM329269.pdf

Sample entry:
SETID|ZIP_FILE_NAME|UPLOAD_DATE|SPL_VERSION|TITLE
897ad8b7-921d-eb02-a61c-3419e662a2da|20121114_897ad8b7-921d-eb02-a61c-3419e662a2da.zip|11/14/2012|5|PRAVACHOL (PRAVASTATIN SODIUM) TABLET [E.R. SQUIBB & SONS, L.L.C.]
