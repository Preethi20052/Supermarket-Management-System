function CategoryCard({ name, image }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="card text-center shadow-sm">
        <img src={image} alt={name} height="120" />
        <div className="card-body">
          <h6>{name}</h6>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
