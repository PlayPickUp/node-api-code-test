type ID = string | number;
type Title = string;
type Position = string;
type CreatedBy = string | number;
type UpdatedAt = null | Date;
type CreatedAt = Date;
type DeletedAt = null | Date;

export interface Bucket {
  id: ID;
  title: Title;
  position: Position;
  created_by_id: CreatedBy;
  updated_at?: UpdatedAt;
  created_at?: CreatedAt;
  deleted_at?: DeletedAt;
}

export interface BucketCreate {
  title: Title;
  position: Position;
  created_by_id: CreatedBy;
}
