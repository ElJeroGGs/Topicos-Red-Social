export const postTypeDefs = /* GraphQL */ `
	type Post @node {
		id: ID! @id
		contenido: String!
		tipo_contenido: String
		visibilidad: String
		status: String

		author: User @relationship(type: "PUBLICA", direction: IN)

		comments: [Comment!]! @relationship(type: "RESPUESTA_A", direction: IN)

		hashtags: [Hashtag!]! @relationship(type: "TIENE", direction: OUT)

		city: City @relationship(type: "UBICADO_EN", direction: OUT)
	}
`;
