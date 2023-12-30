import { useState } from 'react';

function UserProfile() {
    const [user, setUser] = useState({
        name: 'John Doe',
        password: 'password123',
        email: 'johndoe@example.com',
        address: '123 Main St, Anytown, AT 12345',
        regDate: '2023-01-01',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <div className="user-info">
                <label>Name:</label>
                {isEditing ? (
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                ) : (
                    <p style={{color:"black"}}>{user.name}</p>
                )}

                <label>Password:</label>
                {isEditing ? (
                    <input type="password" name="password" value={user.password} onChange={handleChange} />
                ) : (
                    <p style={{color:"black"}}>{'*'.repeat(user.password.length)}</p>
                )}

                <label>Email:</label>
                {isEditing ? (
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                ) : (
                    <p style={{color:"black"}}>{user.email}</p>
                )}

                <label>Address:</label>
                {isEditing ? (
                    <input type="text" name="address" value={user.address} onChange={handleChange} />
                ) : (
                    <p style={{color:"black"}}>{user.address}</p>
                )}

                <label>Registration Date:</label>
                <p style={{color:"black"}}>{user.regDate}</p>

                <button id="saveProfileInfo" onClick={toggleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
            </div>
        </div>
    );
}

export default UserProfile;
