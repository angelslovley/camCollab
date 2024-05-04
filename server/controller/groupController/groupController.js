
const Course = require('../../model/group')
const getGroup = async (req, res) => {
    try {
        let groups = await Group.find();

        const data = {
            success: true,
            message: "All Branches Loaded!",
            groups,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}


const getGroups = async (req, res) => {

    const studentId = req.params.studentId;
    console.log(studentId)
    try {
        const groups = await Group.find({ 'members.user_id': studentId });
        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const addGroup = async (req, res) => {
    let { groupcode,description,members } = req.body;
    try {
        let group = await Group.findOne({ groupcode });
        if (group) {
            const data = {
                success: false,
                message: "Already Exists!",
            };
            res.status(400).json(data);
        } else {
            await Group.create(req.body);
            const data = {
                success: true,
                message: "Group Added!",
            };
            res.json(data);
        }
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateGroup = async (req, res) => {
    const { studentId, groupId } = req.body;
    try {
        // Create an object representing the new member
        const newMember = {
            user_id: studentId,
            role: 'member' // Set the default role here, if needed
        };

        // Find the group by groupId and update its members array to include the new member
        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $push: { members: newMember } }, { new: true });

        if (!updatedGroup) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Return the updated group
        res.status(200).json({ success: true, group: updatedGroup });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



const deleteGroup = async (req, res) => {
    try {
        let group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res
                .status(400)
                .json({ success: false, message: "No Group Data Exists!" });
        }
        const data = {
            success: true,
            message: "Group Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getGroup,getGroups,addGroup,updateGroup,deleteGroup }