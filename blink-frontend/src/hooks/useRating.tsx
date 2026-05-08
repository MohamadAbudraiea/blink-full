import {
  getTicketRating,
  getReviewsFoHome,
  getTicketRatingForSecretary,
  getTicketRatingForDetailer,
} from "@/api/rating";
import type { Rating } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

export const useGetRatingForTicket = (id: string) => {
  const { data, isPending: isFetchingRating } = useQuery({
    queryKey: ["ticketRating", id],
    queryFn: () => getTicketRating({ id }),
  });

  return { rating: data?.data, isFetchingRating };
};

export const useGetReviewsFoHome = (): {
  reviews: Rating[] | undefined;
  isFetchingReviews: boolean;
} => {
  const { data, isPending: isFetchingReviews } = useQuery({
    queryKey: ["reviewsFoHome"],
    queryFn: getReviewsFoHome,
  });

  return { reviews: data?.data, isFetchingReviews };
};

export const useGetRatingForTicketForSecretary = (id: string) => {
  const { data, isPending: isFetchingRating } = useQuery({
    queryKey: ["ticketRatingForSecretary", id],
    queryFn: () => getTicketRatingForSecretary({ id }),
  });

  return { rating: data?.data, isFetchingRating };
};

export const useGetRatingForTicketForDetailer = (id: string) => {
  const { data, isPending: isFetchingRating } = useQuery({
    queryKey: ["ticketRatingForSecretary", id],
    queryFn: () => getTicketRatingForDetailer({ id }),
  });

  return { rating: data?.data, isFetchingRating };
};
