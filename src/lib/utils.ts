export function parseTags(tags:string) {
  try {
    return JSON.parse(tags).map((tag: string)=> {return tag.toLocaleLowerCase()})
  } catch (err) { throw new Error("Tags must be an array of strings") }
}