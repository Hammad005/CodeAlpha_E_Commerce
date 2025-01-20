// eslint-disable-next-line react/prop-types
const Button = ({ icon: Icon, loading, label }) => {
  return (
    <button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
      disabled={loading}
    >
      {loading ? (
        <>
          <Icon className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Loading...
        </>
      ) : (
        <>
          <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
};

export default Button;
