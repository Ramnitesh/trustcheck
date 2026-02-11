import { Ban, CheckCircle, Zap, AlertCircle, Check } from "lucide-react";

interface TrustBadgeProps {
  score: number;
  isVerified: boolean;
  isBanned: boolean;
}

export default function TrustBadge({
  score,
  isVerified,
  isBanned,
}: TrustBadgeProps) {
  if (isBanned) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border-2 border-red-500 rounded-lg">
        <Ban size={24} className="text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-800">BANNED</p>
          <p className="text-xs text-red-600">Trust Score: 0</p>
        </div>
      </div>
    );
  }

  let bgColor = "bg-red-100 border-red-500";
  let textColor = "text-red-800";
  let icon = <AlertCircle size={24} className="text-red-600" />;

  if (score >= 80) {
    bgColor = "bg-green-100 border-green-500";
    textColor = "text-green-800";
    icon = <CheckCircle size={24} className="text-green-600" />;
  } else if (score >= 60) {
    bgColor = "bg-yellow-100 border-yellow-500";
    textColor = "text-yellow-800";
    icon = <Zap size={24} className="text-yellow-600" />;
  } else if (score >= 40) {
    bgColor = "bg-orange-100 border-orange-500";
    textColor = "text-orange-800";
    icon = <AlertCircle size={24} className="text-orange-600" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 ${bgColor} border-2 rounded-lg`}
      >
        {icon}
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>Trust Score</p>
          <p className={`text-2xl font-bold ${textColor}`}>{score}/100</p>
        </div>
      </div>
      {isVerified && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border-2 border-blue-500 rounded-lg">
          <Check size={20} className="text-blue-600" />
          <p className="text-sm font-semibold text-blue-800">
            Verified Business
          </p>
        </div>
      )}
    </div>
  );
}
