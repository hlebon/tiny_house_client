import { useQuery, useMutation } from "../../lib";
import {
  ListingData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

const LISTINGS = `
    query Listings {
        listings{
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface ListingsProps {
  title: string;
}

export function Listings({ title }: ListingsProps) {
  const { data, isLoading, error, refetch } = useQuery<ListingData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ id });
    refetch();
  };

  if (deleteLoading)
    if (isLoading) {
      return <h2>Loading...</h2>;
    }

  if (error) {
    return <h2>Ups! something went wrong, please try again</h2>;
  }

  const deleteListingLoadingMessage = deleteLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteError ? (
    <h4>Ups! Something went wrong with deleting, please try again</h4>
  ) : null;

  const listings = data ? data.listings : [];
  const listingsList = (
    <ul>
      {listings.map(({ id, title }) => {
        return (
          <li key={id}>
            {title}
            <button type="button" onClick={() => handleDeleteListing(id)}>
              delete
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <h1>{title}</h1>
      <ul>{listingsList}</ul>
      {deleteListingErrorMessage}
      {deleteListingLoadingMessage}
    </div>
  );
}
