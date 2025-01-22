import { MULTIPLE_ALL_COORDS } from "./CONSTANTS.ts"

type A3 = [number, number, number]

type Horizon = {
    Altitude: number
    Guid: string
    Id: number
    IsMine: boolean
    Name: string
    ObjectId: number
    Sections: number[]
}
type Horizons = {
    [key: string]: Horizon
}

type Excavation = {
    ExcavationType: string, 
    Id: number,
    Guid: string,
    Sections: number[],
    ObjectId: number,
    Name: string,
}
type Excavations = {
    [key: string]: Excavation
}

type Section = {
    EndNodeId: number
    Guid: string
    Id: number
    StartNodeId: number
    Thickness: number
}
type Sections = {
    [key: string]: Section
}

type Node = {
    Id: number, 
    Guid: string, 
    X: number, 
    Y: number, 
    Z: number,
    pos: A3,
}
type Nodes = {
    [key: string]: Node
}

export class Graph {
    Horizons: Horizons = {}
    Excavations: Excavations = {}
    Sections: Sections = {}
    Nodes: Nodes = {}

    parse (data: any) {
        const { Horizon } = data.Graph.Horizons
        for (let i = 0; i < Horizon.length; ++i) {
            const { Altitude, Guid, Id, IsMine, Name, ObjectId, Sections, } = Horizon[i]
            this.Horizons[Id] = {
                Altitude, 
                Guid, 
                Id, 
                IsMine, 
                Name, 
                ObjectId, 
                Sections,
            }  
        }

        const { Excavation } = data.Graph.Excavations
        for (let i = 0; i < Excavation.length; ++i) {
            const { Name, Id, Guid, ExcavationType, Sections, ObjectId } = Excavation[i]
            let sections: number[]
            if (typeof Sections === "string" && Sections.includes(',')) {
                const nn = Sections.split(',') 
                sections = nn.map(n => +n)
            } else {
                sections = [+Sections] 
            }
            this.Excavations[Id] = {
                Name,
                Id,
                Guid,
                ExcavationType,
                Sections: sections,
                ObjectId,
            }  
        }

        const { Section } = data.Graph.Sections
        for (let i = 0; i < Section.length; ++i) {
            const { EndNodeId, Guid, Id, StartNodeId, Thickness } = Section[i]
            this.Sections[Id] = {
                EndNodeId, 
                Guid, 
                Id, 
                StartNodeId, 
                Thickness,
            }
        }

        const { Node } = data.Graph.Nodes
        for (let i = 0; i < Node.length; ++i) {
            const { Id, Guid: string, X, Y, Z } = Node[i]
            this.Nodes[Id] = {
                Id, 
                Guid: string, 
                X, 
                Y, 
                Z,
                pos: [
                    X * MULTIPLE_ALL_COORDS, 
                    Z * MULTIPLE_ALL_COORDS, 
                    Y * MULTIPLE_ALL_COORDS
                ]
            }
        }
    }

    getMessageById (Id: number): string {
        let str = 'Section:'
        for (let key in this.Sections[Id]) {
            if (key === 'Guid') {
                continue;
            }
            str += ` ${key}: ${this.Sections[Id][key]}`
        }
        return str
    }
}