import { motion } from "framer-motion"

// eslint-disable-next-line react/prop-types
const AnalyticsCard = ({ title, value, icon:Icon, color }) => {
  return (
    <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y:20 }}
    animate={{opacity:1, y:0}}
    transition={{duration:0.5}}
    >
        <div className="flex justify-between items-center">
            <div className="z-10">
                <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
                <p className="text-white text-3xl font-bold">{value}</p>
            </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30">
            <div className="absolute -bottom-4 -right-4 text-emerald-800">
                <Icon className="h-32 w-32"/>
            </div>
        </div>
    </motion.div>
  )
}

export default AnalyticsCard