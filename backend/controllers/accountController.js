export const getAccounts = async (req, res) => {
    try {
        const { userId } = req.body.user;

        const accounts = await pool.query({
            text: "SELECT * FROM tblaccount where user_id = $1",
            values: [userId],
        });

        res.status(200).json({
            status: "success",
            data: accounts.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};

export const createAccount = async (req, res) => {
    try {
        const { userId } = req.body.user;

        const { name, amount, account_number } = req.body;

        const accountExistQuery = {
            text: 'select * from tblaccount where account_name = $1 and user_id = $2',
            values: [name, userId],
        };

        const accountExistResult = await pool.query(accountExistQuery);

        const accountExist = accountExistResult.rows[0];

        if (accountExist) {
            return res
                .status(400)
                .json({ status: "failed", message: "Account already exists" });
        }

        const createAccountResult = await pool.query({
            text: "INSERT INTO tblaccount (user_id, account_name, account_number, account_balance) VALUES ($1, $2, $3, $4) RETURNING *",
            values: [userId, name, account_number, amount],
        });

        const account = createAccountResult.rows[0];

        const userAccounts = Array.isArray(name) ? name : [name];

        const updateUserAccountQuery = {
            text: `UPDATE tbluser SET accounts = array_cat(accounts ,$1), updatedat = current_timestamp WHERE id = $2 RETURNING *`,
            values: [userAccounts, userId],
        };

        await pool.query(updateUserAccountQuery);

        // add initial deposit transaction
        const description = account.account_name + " (Initial deposit)";

        const initialDepositQuery = {
            text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [userId,
                description,
                "income",
                "Completed",
                amount,
                account.name
            ],
        };
        await pool.query(initialDepositQuery);

        res.status(201).json({
            status: "success",
            message: account.account_name + " Account created successfully",
            data: account,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};

export const addMoneyToAccount = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};