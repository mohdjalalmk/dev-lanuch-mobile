export const groupByCategory = (courses: any[]) => {
  const groups: Record<string, any[]> = {};
  courses.forEach(course => {
    const category = course.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(course);
  });

  return Object.entries(groups).map(([name, courses]) => ({
    name,
    courses,
  }));
};
