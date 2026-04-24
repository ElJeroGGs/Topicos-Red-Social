export const relationshipProps = /* GraphQL */ `
	type Timestamped @relationshipProperties {
		fecha_relacion: DateTime
	}

	type TypedRelation @relationshipProperties {
		tipo: String!
	}

	type TimestampedTyped @relationshipProperties {
		fecha_relacion: DateTime
		tipo: String!
	}
`;
