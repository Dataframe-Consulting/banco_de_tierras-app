interface Card404Props {
  title: string;
  description: string;
}

const Card404 = ({ title, description }: Card404Props) => {
  return (
    <div className="p-4 text-center">
      <strong className="text-3xl">404. Not found</strong>
      <p className="text-2xl">{title}</p>
      <small className="text-xl">{description}</small>
    </div>
  );
};

export default Card404;
