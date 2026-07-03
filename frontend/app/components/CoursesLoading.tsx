function CoursesLoading() {
  return (
    <div className="w-full min-h-screen flex mt-20 flex-col gap-20 p-5 items-center justify-center bg-background text-foreground">
      <h3 className="text-4xl md:text-5xl font-bold text-center mt-10 mb-5 text-foreground">
        الكورسات
      </h3>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse"
          >
            {/* Image */}
            <div className="w-full h-56 bg-muted" />

            {/* Content */}
            <div className="p-6 space-y-4 bg-secondary/30 backdrop-blur-xs">
              {/* Title */}
              <div className="h-6 bg-muted/80 rounded w-3/4" />

              {/* Description */}
              <div className="h-4 bg-muted/70 rounded w-full" />
              <div className="h-4 bg-muted/70 rounded w-5/6" />

              {/* Price */}
              <div className="h-5 bg-muted/60 rounded w-1/4 ml-auto" />

              {/* Button */}
              <div className="h-12 bg-primary/40 rounded-xl w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesLoading;
