import { useState, useRef } from 'react'
import axios from 'axios'
import {SERVER_URL} from "../../lib/constants/constants.js";

export function useTokenMetadata() {
    const [data, setData] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const pendingRef = useRef(new Set())
    const cancelRef = useRef(false)

    const fetchMetadata = async ids => {
        cancelRef.current = false
        pendingRef.current = new Set(ids)
        setData([])
        setErrors({})
        setLoading(true)

        while (pendingRef.current.size && !cancelRef.current) {
            try {
                const { data: response } = await axios.post(SERVER_URL + '/api/rings', {
                    ids: Array.from(pendingRef.current),
                })

                let anySuccess = false
                if(response) {
                    anySuccess = true;
                    setData(response)
                }

                // If any id successfully got metadata — stop all subsequent calls
                if (anySuccess) break
            } catch (e) {
                pendingRef.current.forEach(id =>
                    setErrors(prev => ({ ...prev, [id]: e.message }))
                )
            }

            if (pendingRef.current.size) {
                await new Promise(r => setTimeout(r, 10000))
            }
        }

        if (!cancelRef.current) setLoading(false)
    }

    const cancel = () => {
        cancelRef.current = true
        setLoading(false)
    }

    const clear = () => {
        pendingRef.current.clear()
        setData({})
        setErrors({})
        setLoading(false)
    }

    return { data, errors, loading, fetchMetadata, cancel, clear }
}
