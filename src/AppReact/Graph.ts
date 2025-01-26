import { MULTIPLE_ALL_COORDS } from "../ThreeViewer/CONSTANTS.ts";

type A3 = [number, number, number]

interface Horizon {
    Altitude: number
    Guid: string
    Id: number
    IsMine: boolean
    Name: string
    ObjectId: number
    Sections: number[]
}
interface Horizons {
    [Id: number]: Horizon
}

interface Excavation {
    ExcavationType: string
    Id: number
    Guid: string
    Sections: number[]
    ObjectId: number
    Name: string
}
interface Excavations {
    [Id: number]: Excavation
}

interface Section {
    EndNodeId: number
    Guid: string
    Id: number
    StartNodeId: number
    Thickness: number
}
interface Sections {
    [Id: number]: Section
}

interface Node {
    Id: number
    Guid: string
    X: number
    Y: number
    Z: number
    pos: A3  // координаты умноженные на MULTIPLE_ALL_COORDS
}
interface Nodes {
    [Id: number]: Node
}

/** Разбирает строку вида "10,11,12" в массив чисел [10,11,12] */
const parseSectionsString = (sections: string): number[] => {
    return sections
        .split(",")
        .map((s) => parseInt(s, 10))
        .filter((num) => !Number.isNaN(num));
}

export class Graph {
    Horizons: Horizons = {}
    Excavations: Excavations = {}
    Sections: Sections = {}
    Nodes: Nodes = {}

    parse(data: any) {
        // Предполагается, что структура data выглядит так:
        // data.Graph.Horizons.Horizon
        // data.Graph.Excavations.Excavation
        // data.Graph.Sections.Section
        // data.Graph.Nodes.Node
        const graphData = data?.Graph
        if (!graphData) {
            console.warn("Неверные данные: отсутствует поле 'Graph'.");
            return
        }

        const horizonArray = graphData.Horizons?.Horizon ?? []
        horizonArray.forEach((horizonItem: any) => {
            const {
                Altitude,
                Guid,
                Id,
                IsMine,
                Name,
                ObjectId,
                Sections
            } = horizonItem;
            if (typeof Id !== "number") return;

            this.Horizons[Id] = {
                Altitude,
                Guid,
                Id,
                IsMine,
                Name,
                ObjectId,
                Sections: parseSectionsString(Sections),
            }
        })

        const excavationArray = graphData.Excavations?.Excavation ?? []
        excavationArray.forEach((excavationItem: any) => {
            const {
                Name,
                Id,
                Guid,
                ExcavationType,
                Sections,
                ObjectId
            } = excavationItem;
            if (typeof Id !== "number") return;

            let sectionsParsed: number[]
            if (typeof Sections === "string") {
                sectionsParsed = parseSectionsString(Sections)
            } else {
                sectionsParsed = [Number(Sections)].filter((n) => !Number.isNaN(n));
            }

            this.Excavations[Id] = {
                Name,
                Id,
                Guid,
                ExcavationType,
                Sections: sectionsParsed,
                ObjectId,
            };
        });

        const sectionArray = graphData.Sections?.Section ?? []
        sectionArray.forEach((sectionItem: any) => {
            const {
                EndNodeId,
                Guid,
                Id,
                StartNodeId,
                Thickness
            } = sectionItem;
            if (typeof Id !== "number") return;

            this.Sections[Id] = {
                EndNodeId,
                Guid,
                Id,
                StartNodeId,
                Thickness,
            }
        })

        const nodeArray = graphData.Nodes?.Node ?? []
        nodeArray.forEach((nodeItem: any) => {
            const {
                Id,
                Guid,
                X,
                Y,
                Z
            } = nodeItem;
            if (typeof Id !== "number") return;

            this.Nodes[Id] = {
                Id,
                Guid,
                X,
                Y,
                Z,
                pos: [
                    X * MULTIPLE_ALL_COORDS,
                    Z * MULTIPLE_ALL_COORDS,
                    Y * MULTIPLE_ALL_COORDS,
                ],
            };
        });

        console.log("Graph parsed:", this);
    }

    getHorizonsNames(): string[] {
        return Object.values(this.Horizons).map((horizon) => horizon.Name);
    }

    getSectionsByHorizonName(name: string): number[] {
        const horizon = Object.values(this.Horizons).find(
            (h) => h.Name === name
        );
        if (!horizon) {
            return [];
        }
        return horizon.Sections;
    }

    getSectionData (sectionId: number | null) {
        if (!sectionId) {
            return null;
        }
        const section = this.Sections[sectionId]
        if (!section) {
            return null
        }
        return (
            `Section: ${section.Id}, ` +
            `StartNodeId: ${section.StartNodeId}, ` +
            `EndNodeId: ${section.EndNodeId}, ` + 
            `Thickness: ${section.Thickness}, ` + 
            `Guid: ${section.Guid}`
        )
    }
}
