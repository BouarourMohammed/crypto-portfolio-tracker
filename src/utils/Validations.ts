import * as yup from "yup";

const amount = yup
  .number()
  .required("Amount is required")
  .positive("Amount must be positive");

export const createDepositWithdrawValidationSchema = (
  variant: "Deposit" | "withdraw",
  currentBalance: number
) => {
  return yup.object().shape({
    amount:
      variant === "Deposit"
        ? amount
        : amount.test(
            "insufficient-balance",
            "Withdrawal amount cannot exceed your balance : " + currentBalance,
            function (value) {
              return value <= currentBalance;
            }
          ),
  });
};

const rate = yup
  .number()
  .required("Rate is required")
  .positive("Rate must be positive");

export const notificationSchema = yup.object().shape({
  // asset: yup.string().required("Asset is required"),
  // currency: yup.string().required("Currency is required"),
  amount: rate,
});
