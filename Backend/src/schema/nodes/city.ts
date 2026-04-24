export const cityTypeDefs = /* GraphQL */ `
	type City @node {
		id: ID!
		nombre: String!
		estado: String
		pais: String

		residents: [User!]! @relationship(type: "VIVE_EN", direction: IN)

		birthResidents: [User!]! @relationship(type: "NACIO_EN", direction: IN)

		posts: [Post!]! @relationship(type: "UBICADO_EN", direction: IN)

		events: [Event!]! @relationship(type: "OCURRE_EN", direction: IN)
	}
`;
