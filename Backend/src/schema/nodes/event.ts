export const eventTypeDefs = /* GraphQL */ `
	type Event @node {
		id: ID!
		titulo: String!
		descripcion: String
		fecha_inicio: DateTime
		fecha_fin: DateTime
		modalidad: String
		lugar: String
		capacidad: Int
		status: String

		attendees: [User!]!
			@relationship(type: "ASISTE", direction: IN, properties: "TypedRelation")

		savedBy: [User!]! @relationship(type: "GUARDA", direction: IN, properties: "TypedRelation")

		organizers: [User!]!
			@relationship(type: "ORGANIZA", direction: IN, properties: "TypedRelation")

		city: City @relationship(type: "OCURRE_EN", direction: OUT)
	}
`;
