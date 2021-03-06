# Enhance CAPI
The enhance CAPI pattern is one where the CAPI object is transformed into a different, more useable, format. In particular, it relates to the `blocks` array. Each enhancement function, takes the `CAPIType` and returns the `CAPIType`.

## Lexicon
An 'enhancement' could also be termed a 'transformation' and in other places similar functions are refrered to as 'cleaners'.

## Why?
Ideally, these transformations would not be required. A better solution would be to construct the array at source, in Composer or CAPI, with the ideal structure. But for - probably very good - reasons the decision was taken to use [cleaners in frontend](https://github.com/guardian/frontend/blob/aa0013a6f9c247be36d29b9716e0ccc80cc8b218/common/app/views/support/HtmlCleaner.scala) to solve design problems. So now, in order to support the same designs, we need to replicate these cleaners in DCR. The enhancements are applied in the [server/render.ts](/src/web/server/render.ts).

## Examples

### DropCaps
Certain article types, such as Features, have the first letter of the first paragraph marked as a DropCap. However, there was a requirement to sometimes also have other paragraphs be given a DropCap. But composer does not offer a way to mark a paragraph as, say, dropcap: true, so instead a convention was invented where if the preceeding element was a h2 tag containing '* * *' then that was the trigger to give the following paragraph drop cap styling.

In DCR we replicate this using [add-dropcaps.ts](/src/model/add-dropcaps.ts)

### Photo Essays
The blocks array for Photo essay articles needs a lot of cleaning to achieve the intended designs. They use special caption styles, sometimes have titles overlaying images and position images differently.

In DCR we replicate these changes using [enhance-photoessays.ts](/src/model/enhance-photoessays.ts)

## How remove these enhancement functions
The construction of these functions has been done  with the goal of removing them in mind. Where changes to elements have been needed they have been done in such  a way as to be generic. For example, the special image titles used in photo essays are available for all images, on all article types. By doing this we create a design language that is more flexible so that if we later improve Composer to support, say, adding drop caps to any paragraph, or adding a title string to an image, then this will just work.

For more information on how and why we'd like to improve cleaners see: https://docs.google.com/document/d/1ESuP7jEOEdbqbJ3mwuBXJxt6wXuGv9_klP3e2JXfSQY/edit
