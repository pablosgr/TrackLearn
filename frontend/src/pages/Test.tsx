import { useUserData } from "../context/UserContext";

export default function Test() {
    const { userData } = useUserData();

    if (userData?.role !== 'teacher') {
        return (
            <div>
                <h1>Tests</h1>
                <p>You are not authorized to view this page, unless you are admin..</p>
            </div>
        );
    }

    return (
        <>
            <h1>Tests</h1>
            <p>This is the tests page. You have to be a teacher to be here.</p>
        </>
    )
}
