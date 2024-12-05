import { db } from '@acme/database/client';
import { Course } from '@acme/database/schema';

export default async function Page() {
  const courses = await db.select().from(Course);
  const course = courses[0];
  if (!course) {
    return <div>no courses</div>;
  }
  return (
    <div>
      <h1>
        Title:
        {course.title}
      </h1>
      <h2>
        Description:
        {course.description}
      </h2>
      <h3>
        Tags:
        {course.tags.join(', ')}
      </h3>
    </div>
  );
}
