export const commentTypeDefs = /* GraphQL */ `
	type Comment @node {
		id: ID! @id
		contenido: String!
		status: String

		author: User @relationship(type: "COMENTA", direction: IN)

		post: Post @relationship(type: "RESPUESTA_A", direction: OUT)

		parent: Comment @relationship(type: "RESPUESTA_A", direction: OUT)
	}
`;
