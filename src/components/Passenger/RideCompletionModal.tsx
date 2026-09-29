import { CheckCircle2, Download, Heart, Star, ThumbsUp, X, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { formatCurrency } from '../../utils/geo';

export const RideCompletionModal: React.FC = () => {
  const { currentRide, rateAndTipRide, drivers, language, resetRideState } = useRide();
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(2);
  const [customTip, setCustomTip] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isDismissed || !currentRide || currentRide.status !== 'completed') return null;

  const assignedDriver = (currentRide.assignedDriverId ? drivers.find((d) => d.id === currentRide.assignedDriverId) : null) || drivers[0] || {
    id: 'live_driver',
    name: 'Wadaage Driver Captain',
    phone: '+252 63 6807814',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    vehicle: { model: 'Toyota Vitz', licensePlate: 'SL-24810', color: 'White' },
  };
  const finalTip = customTip ? parseFloat(customTip) || 0 : tip;

  const handleInstantClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDismissed(true);
    rateAndTipRide(rating, 0);
    resetRideState();
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSubmitted(true);
    rateAndTipRide(rating, finalTip);
    setTimeout(() => {
      setIsDismissed(true);
      resetRideState();
    }, 400);
  };

  const handleSkipAndClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDismissed(true);
    rateAndTipRide(rating, 0);
    resetRideState();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none touch-manipulation">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 text-center relative max-h-[92vh] overflow-y-auto">
        {/* Direct Instant Close (X) button in top-right */}
        <button
          type="button"
          onClick={handleInstantClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-xs z-10"
          title={language === 'so' ? 'Xidh oo ku laabo bogga hore' : 'Close and return to home'}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Success Icon Header */}
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'so' ? 'Waa la soo gaadhay!' : 'Arrived at Destination!'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'so'
              ? `Waad ku mahadsan tahay raacidda WadaageTaxi. Waxaad timid: `
              : `Thank you for riding with WadaageTaxi. You arrived at: `}
            <b className="text-slate-800 dark:text-slate-200">{currentRide.dropoff?.name || 'Hargeisa'}</b>.
          </p>
        </div>

        {/* Fare Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
              {language === 'so' ? 'Wadarta Lacagta' : 'Total Fare Paid'}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Via {(currentRide.paymentMethod || 'cash').toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(Number(currentRide.totalFare) || 0)}
            </span>
          </div>
        </div>

        {/* Rate Driver */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-center space-x-2.5">
            <img
              src={assignedDriver.avatar}
              alt={assignedDriver.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'so' ? `Sidee u aragtay duuliyaha ${assignedDriver.name}?` : `How was your ride with ${assignedDriver.name}?`}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">{assignedDriver.vehicle.model} • {assignedDriver.vehicle.licensePlate}</div>
            </div>
          </div>

          <div className="flex justify-center space-x-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 transition-transform hover:scale-125 active:scale-95 cursor-pointer touch-manipulation"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'text-amber-400 fill-amber-400 drop-shadow-xs' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tip Driver */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'so' ? 'Ku dar Tip duuliyaha (Ikhtiyaari)' : 'Add a Tip for Driver (Optional)'}</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 5].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setTip(amt);
                  setCustomTip('');
                }}
                className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer touch-manipulation active:scale-95 ${
                  tip === amt && !customTip
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {amt === 0 ? (language === 'so' ? 'Maya' : 'No Tip') : `$${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Receipt Download Action */}
        <div className="pt-1 flex items-center justify-center text-xs border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowReceipt(true)}
            className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 font-semibold flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>{language === 'so' ? 'Fiiri Rasiidka Safarka' : 'View Detailed Receipt'}</span>
          </button>
        </div>

        {/* Action Buttons: Submit & Skip */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isSubmitted}
            onClick={handleSubmit}
            className="w-full bg-[#008751] hover:bg-[#007445] active:bg-[#006038] text-white font-black py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-sm uppercase tracking-wide cursor-pointer touch-manipulation flex items-center justify-center space-x-2"
          >
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5 stroke-[3] animate-bounce" />
                <span>{language === 'so' ? 'Waa la gudbiyey! Mahadsanid...' : 'Submitted! Thank you...'}</span>
              </>
            ) : (
              <span>{language === 'so' ? 'Gudbi oo Ku Laabo Bogga Hore' : 'SUBMIT & RETURN TO HOME'}</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleSkipAndClose}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer touch-manipulation active:scale-[0.98]"
          >
            {language === 'so' ? 'Ka bood oo Ku Laabo Bogga Hore' : 'SKIP & RETURN TO HOME'}
          </button>
        </div>
      </div>

      {/* Digital Receipt Overlay Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-lg">Official Ride Receipt</h3>
                <p className="text-xs text-slate-500">Trip ID: #{currentRide.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs border-b pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger:</span>
                <span className="font-bold">{currentRide.passengerName || 'Passenger'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Driver:</span>
                <span className="font-bold">{assignedDriver.name} ({assignedDriver.vehicle.licensePlate})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup:</span>
                <span className="font-semibold">{currentRide.pickup?.name || 'Pickup Location'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dropoff:</span>
                <span className="font-semibold">{currentRide.dropoff?.name || 'Dropoff Destination'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Distance & Time:</span>
                <span>{currentRide.distanceKm} km • {currentRide.durationMins} mins</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs border-b pb-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Base & Distance Fare:</span>
                <span>{formatCurrency(currentRide.baseFare + currentRide.distanceKm * 1.25)}</span>
              </div>
              {currentRide.surgeMultiplier > 1.0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Surge Multiplier ({currentRide.surgeMultiplier}x):</span>
                  <span>Applied</span>
                </div>
              )}
              {currentRide.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount / Shared Savings:</span>
                  <span>-{formatCurrency(currentRide.discountAmount)}</span>
                </div>
              )}
              {finalTip > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Driver Tip:</span>
                  <span>+{formatCurrency(finalTip)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-1 text-sm font-black">
              <span>Total Paid ({((currentRide.paymentMethod || 'cash')).toUpperCase()}):</span>
              <span className="text-emerald-600 text-lg">
                {formatCurrency((Number(currentRide.totalFare) || 0) + finalTip)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
