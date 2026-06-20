import { Clock, MapPin } from 'lucide-react'

const ScheduleView = ({ route }) => {
    if (!route) return null

    const { name, number, stops } = route

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-white">{number}</span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">Schedule & Stops</p>
                </div>
            </div>

            <div className="space-y-4">
                {stops.map((stop, index) => (
                    <div key={index} className="relative">
                        {/* Timeline connector */}
                        {index < stops.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-12 bg-gradient-to-b from-primary-400 to-secondary-400" />
                        )}

                        <div className="flex items-start space-x-4">
                            {/* Timeline dot */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${index === 0 || index === stops.length - 1
                                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600'
                                    : 'bg-white border-2 border-primary-400'
                                }`}>
                                {(index === 0 || index === stops.length - 1) ? (
                                    <MapPin className="w-4 h-4 text-white" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                                )}
                            </div>

                            {/* Stop info */}
                            <div className="flex-1 pb-8">
                                <div className="glass rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{stop.name}</h4>
                                        <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-lg">
                                            <Clock className="w-4 h-4 text-primary-600" />
                                            <span className="text-sm font-semibold text-gray-900">{stop.time}</span>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <p className="text-sm text-gray-600">Starting point</p>
                                    )}
                                    {index === stops.length - 1 && (
                                        <p className="text-sm text-gray-600">Final destination</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScheduleView
