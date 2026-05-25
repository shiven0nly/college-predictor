import { FiStar, FiUser } from "react-icons/fi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  academicsRating: number | null;
  placementRating: number | null;
  infrastructureRating: number | null;
  facultyRating: number | null;
  campusLifeRating: number | null;
  batch: number | null;
  course: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="reviews" className="scroll-mt-28 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {review.user.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user.name || "User"}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <FiUser className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{review.user.name || "Anonymous"}</span>
                        {review.course && <span>• {review.course}</span>}
                        {review.batch && <span>• Batch {review.batch}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.content}
                </p>
                
                {/* Category Ratings */}
                {(review.academicsRating ||
                  review.placementRating ||
                  review.infrastructureRating ||
                  review.facultyRating ||
                  review.campusLifeRating) && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t">
                    {review.academicsRating && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Academics</div>
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.academicsRating}</span>
                        </div>
                      </div>
                    )}
                    {review.placementRating && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Placements</div>
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.placementRating}</span>
                        </div>
                      </div>
                    )}
                    {review.infrastructureRating && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Infrastructure</div>
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.infrastructureRating}</span>
                        </div>
                      </div>
                    )}
                    {review.facultyRating && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Faculty</div>
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.facultyRating}</span>
                        </div>
                      </div>
                    )}
                    {review.campusLifeRating && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Campus Life</div>
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.campusLifeRating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
