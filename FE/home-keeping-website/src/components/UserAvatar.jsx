const UserAvatar = ({ src, size = 40 }) => (
    <img
      src={src || "https://via.placeholder.com/40x40?text=👤"}
      alt="Avatar"
      className="rounded-circle"
      width={size}
      height={size}
      style={{ objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
    />
  );
  
  export default UserAvatar;
  