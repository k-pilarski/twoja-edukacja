interface CourseCardProps {
  title: string;
  description: string;
  price: number;
}

export const CourseCard = ({ title, description, price }: CourseCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">

      <div className="h-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
      
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-blue-600 text-xl">{price} PLN</span>
        <button className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Zobacz
        </button>
      </div>
    </div>
  );
};