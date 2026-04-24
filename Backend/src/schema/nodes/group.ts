export const groupTypeDefs = /* GraphQL */ `
	type Group @node {
		id: ID!
		nombre: String!
		descripcion: String
		privacidad: String
		fecha_creacion: DateTime
		status: String

		members: [User!]! @relationship(type: "PERTENECE_A", direction: IN)

		admins: [User!]! @relationship(type: "ADMINISTRA", direction: IN)
	}
`;
