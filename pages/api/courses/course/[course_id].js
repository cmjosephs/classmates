// PUT: /pages/api/courses/course/[course_id].js

import { db } from '../../../../utils/api/firebase.config';
import {
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

/* add student to course's mentee list */
export default async function updateCourseMenteeList(req, res) {
  const { course_id } = req.query;
  const {
    mentee_id,
    mentee_firstName,
    mentee_lastName
  } = req.body;

  try {
    const querySnapshot = await updateDoc(doc(db, 'courses', course_id), {
      mentees: arrayUnion({
        id: mentee_id,
        name: {
          first_name: mentee_firstName,
          last_name: mentee_lastName
        },
        photo: "https://robohash.org/"+mentee_firstName+mentee_lastName
      })
    });
    res.status(200).json(`Successfully added student to course ${course_id}`);
  } catch (err) {
    res.status(400).send(`Error adding student to course ${course_id}: ${err}`);
  }
}
  // if (course_type === 'Public') {
    //   // post to courses collection


    //   // update: add to mentees list on this course obj

    // } else {
    //   // post to notifications collection
    //   // if mentee_status === declined --> delete from notifications collection
    //   // if mentee_status === accepted --> delete from notifications collection and add to courses collection

    //   const post = {
    //     course_id,
    //     course_name,
    //     mentor_id,
    //     mentor_name,
    //     mentee_id,
    //     mentee_name,
    //     mentee_status: 'pending' // pending initially, accepted, declined
    //   }
    // }


