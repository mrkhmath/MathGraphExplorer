import { useQuery, gql } from '@apollo/client';
import ConceptGraph from '../components/ConceptGraph';

const  GET_CONCEPT_GRAPH = gql`
  query {
    concepts {
      id
      code
      label
      description
      grade_levels
      uri
      created
      identifier
      typeIRI
      elementId
      tld

      inferredAlignmentsConnection {
        edges {
          properties {
            alignmentType
            confidence
          }
          node {
            id
            code
            label
            description
            grade_levels
            uri
            created
            identifier
            typeIRI
            elementId
            tld
          }
        }
      }
    }
  }
`;

export default function Explore() {
  const { loading, error, data } = useQuery(GET_CONCEPT_GRAPH);

  if (loading) return <p>Loading...</p>;
  if (error || !data || !data.concepts) {
    console.error('GraphQL error:', error);
    return <p style={{ color: 'red' }}>Error loading graph</p>;
  }

  return (
    <ConceptGraph concepts={data.concepts} />
  );
}
