function Input({ label, value, onChange, type="text" }:any){
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full mt-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
export default Input;