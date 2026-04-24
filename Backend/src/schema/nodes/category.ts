export const categoryTypeDefs = /* GraphQL */ `
	type Category @node {
		id: ID! @id
		nombre: String!
		descripcion: String

		parent: Category @relationship(type: "SUBCATEGORIA_DE", direction: OUT)

		children: [Category!]! @relationship(type: "SUBCATEGORIA_DE", direction: IN)
	}
`;
