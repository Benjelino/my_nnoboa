export class Category {
  catId: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  tags: string;
}

export class Categorys {
  Categories: Category[];
  httpStatus: string;
}
