const { XMLParser } = require("fast-xml-parser")

export const loadXMLFile = (xmlFile: string): Object => {
    return new Promise(res => {
        const reader = new FileReader()
        reader.addEventListener("loadend", () => {
            const parser = new XMLParser()
            const jsObj = parser.parse(reader.result)
            res(jsObj)
        })
        fetch(xmlFile)
          .then(response => response.blob())
          .then(blob => reader.readAsText(blob, "windows-1251"))
    })
}


