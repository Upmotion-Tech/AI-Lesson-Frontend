import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { resendLoginOtp, verifyLoginOtp } from "../store/authThunks.js";

const OTP_LENGTH = 6;
const RESEND_INTERVAL = 180;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    pendingUser,
    otpRequired,
    token,
    otpToken,
    pendingRememberMe,
    otpVerificationStatus,
    otpResendStatus,
    otpLastSentAt,
  } = useAppSelector((state) => state.auth);
  const emailFromState = location.state?.email;
  const email = emailFromState || pendingUser?.email;
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const lastSubmittedCodeRef = useRef("");
  const isSubmitting = otpVerificationStatus === "loading";
  const isResending = otpResendStatus === "loading";

  useEffect(() => {
    if (!otpRequired) {
      if (token) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (otpRequired && !otpToken) {
      navigate("/login", { replace: true });
    }
  }, [otpRequired, otpToken, token, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const secondsRemaining = useMemo(() => {
    if (!otpLastSentAt) {
      return RESEND_INTERVAL;
    }
    const elapsed = Math.floor((currentTime - otpLastSentAt) / 1000);
    return Math.max(RESEND_INTERVAL - elapsed, 0);
  }, [otpLastSentAt, currentTime]);

  const submitOtp = useCallback(
    async (code) => {
      if (code.length !== OTP_LENGTH) {
        setError("Please enter the 6-digit code we sent you.");
        return;
      }

      if (!otpToken) {
        toast.error("Your session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      lastSubmittedCodeRef.current = code;

      const result = await dispatch(
        verifyLoginOtp({
          otpCode: code,
          otpToken,
          rememberMe: pendingRememberMe,
        })
      );

      if (verifyLoginOtp.fulfilled.match(result)) {
        toast.success("OTP verified successfully");
        navigate("/", { replace: true });
      } else {
        const message =
          result.payload || result.error?.message || "OTP verification failed";
        setError(message);
        toast.error(message);
      }
    },
    [dispatch, navigate, otpToken, pendingRememberMe]
  );

  const attemptAutoSubmit = useCallback(
    (values) => {
      const allDigitsFilled = values.every((digit) => digit !== "");
      if (
        allDigitsFilled &&
        !isSubmitting &&
        otpToken &&
        lastSubmittedCodeRef.current !== values.join("")
      ) {
        submitOtp(values.join(""));
      }
    },
    [isSubmitting, otpToken, submitOtp]
  );

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedValues = [...otpValues];
    updatedValues[index] = value;
    setOtpValues(updatedValues);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    attemptAutoSubmit(updatedValues);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const values = Array(OTP_LENGTH)
      .fill("")
      .map((_, idx) => pasted[idx] || "");

    setOtpValues(values);
    setError("");
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
    attemptAutoSubmit(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    submitOtp(otpValues.join(""));
  };

  const handleResend = async () => {
    if (secondsRemaining > 0 || !otpToken || isResending) return;

    const result = await dispatch(resendLoginOtp({ otpToken }));

    if (resendLoginOtp.fulfilled.match(result)) {
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setCurrentTime(Date.now());
      toast.success("OTP resent to your email");
    } else {
      const message =
        result.payload || result.error?.message || "Failed to resend code";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-full mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Verify your account
          </h1>
          <p className="text-sm text-muted-foreground">
            {email
              ? `Enter the 6-digit verification code sent to ${email}`
              : "Enter the 6-digit verification code sent to your email"}
          </p>
        </div>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="grid grid-cols-6 gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="h-12 sm:h-14 rounded-lg border border-input bg-background text-center text-lg font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label={`Digit ${index + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {/* <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </Button> */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  className={`font-medium ${
                    secondsRemaining === 0 && !isResending
                      ? "text-primary hover:opacity-80"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                  onClick={handleResend}
                  disabled={secondsRemaining !== 0 || isResending}
                >
                  {isResending ? "Sending..." : "Resend code"}
                </button>
              </p>
              <p className="text-xs">
                {secondsRemaining === 0
                  ? "You can request a new code now."
                  : `You can request a new code in ${secondsRemaining}s.`}
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
