export const userTypeDefs = /* GraphQL */ `
	type User @node {
		id: ID! @id
		username: String!
		nombre: String!
		apellido: String!
		correo: String!
		password_hash: String!
		bio: String
		fecha_registro: DateTime
		fecha_nacimiento: DateTime
		foto_perfil_url: String
		status: String

		follows: [User!]! @relationship(type: "SIGUE", direction: OUT, properties: "Timestamped")

		blocked: [User!]! @relationship(type: "BLOQUEA", direction: OUT, properties: "Timestamped")

		posts: [Post!]! @relationship(type: "PUBLICA", direction: OUT, properties: "Timestamped")

		comments: [Comment!]!
			@relationship(type: "COMENTA", direction: OUT, properties: "Timestamped")

		reactionsPost: [Post!]!
			@relationship(type: "REACCIONA", direction: OUT, properties: "TypedRelation")

		reactionsComment: [Comment!]!
			@relationship(type: "REACCIONA", direction: OUT, properties: "Timestamped")

		shares: [Post!]!
			@relationship(type: "COMPARTE", direction: OUT, properties: "TypedRelation")

		savedPosts: [Post!]!
			@relationship(type: "GUARDA", direction: OUT, properties: "TypedRelation")

		groups: [Group!]!
			@relationship(type: "PERTENECE_A", direction: OUT, properties: "Timestamped")

		city: City @relationship(type: "VIVE_EN", direction: OUT)

		birthCity: City @relationship(type: "NACIO_EN", direction: OUT)
	}
`;
