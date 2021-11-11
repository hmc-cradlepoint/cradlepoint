import connectToDb from "../../util/mongodb";
import withSession from '../../util/session';
/*
 gets user by email from database
*/
export default withSession(async (req, res) => {
  const { loginEmail } = await req.body;
  try {
    // Query Database w/ LoginEmail
    const query = { email: loginEmail };
    const db = await connectToDb();
    const results = await db.collection("user").find(query).toArray();
    // Set User & store info in session
    const user = {
      isLoggedIn: true, 
      firstName: results[0].firstName, 
      lastName: results[0].lastName,
      userType: results[0].userType
    };
    console.log("User:", user, typeof(results));
    req.session.set('user', user);
    console.log("Got Past the session set");
    await req.session.save();
    console.log("Got Past the session save");
    res.json(user);
  } catch (error) {
    console.log("LOGIN-API-ERROR");
    const { response: fetchResponse } = error
    res.status(fetchResponse?.status || 500).json(error.data)
  }

});