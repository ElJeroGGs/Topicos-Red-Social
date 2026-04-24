export const hashtagTypeDefs = /* GraphQL */ `
	type Hashtag @node {
		id: ID!
		nombre: String!
		descripcion: String
		fecha_creacion: DateTime

		posts: [Post!]! @relationship(type: "TIENE", direction: IN)

		categories: [Category!]! @relationship(type: "PERTENECE_A", direction: OUT)
	}
`;
