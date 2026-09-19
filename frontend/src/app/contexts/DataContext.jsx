import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

const GATEWAY_URL = import.meta.env.VITE_API_URL || '';

export function DataProvider({ children }) {
    const [inventory, setInventory] = useState([]);
    const [hospitalRequests, setHospitalRequests] = useState([]);
    const [bloodTests, setBloodTests] = useState([]);
    const [camps, setCamps] = useState([]);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('auth_token');
        return fetch(`${GATEWAY_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    };

    const loadAllData = async () => {
        setLoading(true);
        try {
            // Inventory
            const invRes = await fetchWithAuth('/api/inventory/available');
            if (invRes.ok) setInventory(await invRes.json());

            // Requests
            const reqRes = await fetchWithAuth('/api/request-issue/all');
            if (reqRes.ok) setHospitalRequests(await reqRes.json());

            // Camps
            const campRes = await fetchWithAuth('/api/camps');
            if (campRes.ok) setCamps(await campRes.json());

            // Blood Tests
            const testRes = await fetchWithAuth('/api/inventory/tests');
            if (testRes.ok) setBloodTests(await testRes.json());

            // Donors
            const donorRes = await fetchWithAuth('/api/donors');
            if (donorRes.ok) setDonors(await donorRes.json());

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            loadAllData();
        }
    }, []);

    const addRequest = async (request) => {
        const res = await fetchWithAuth('/api/request-issue', {
            method: 'POST',
            body: JSON.stringify(request)
        });
        if (res.ok) loadAllData();
    };

    const cancelRequest = async (id) => {
        console.log('Cancelling request with ID:', id);
        // Optimistic local update - check both id and _id
        setHospitalRequests(prev => {
            const filtered = prev.filter(req => {
                const reqId = req.id || req._id;
                return String(reqId) !== String(id);
            });
            console.log(`Optimistic update: reduced from ${prev.length} to ${filtered.length} requests`);
            return filtered;
        });

        try {
            const res = await fetchWithAuth(`/api/request-issue/${id}/cancel`, {
                method: 'PUT'
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to cancel request on server:', errorText);
                loadAllData();
            } else {
                console.log('Server confirmed cancellation for:', id);
            }
        } catch (error) {
            console.error('Error in cancelRequest:', error);
            loadAllData();
        }
    };

    const updateRequestStatus = async (id, status) => {
        const endpoint = status === 'fulfilled' ? 'approve' : 'reject';
        const res = await fetchWithAuth(`/api/request-issue/${id}/${endpoint}`, {
            method: 'PUT'
        });
        if (res.ok) loadAllData();
        return res;
    };

    const addInventory = async (item) => {
        const res = await fetchWithAuth('/api/inventory/bloodbag', {
            method: 'POST',
            body: JSON.stringify(item)
        });
        if (res.ok) {
            loadAllData();
            return true;
        }
        return false;
    };

    const deleteInventory = async (id) => {
        const res = await fetchWithAuth(`/api/inventory/bloodbag/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            loadAllData();
            return true;
        }
        return false;
    };

    const updateInventory = async (id, units) => {
        const res = await fetchWithAuth(`/api/inventory/bloodbag/${id}?units=${units}`, {
            method: 'PATCH'
        });
        if (res.ok) {
            loadAllData();
            return true;
        }
        return false;
    };

    const verifyDonor = async (id, status, healthStatus, hemoglobin, rejectionReason) => {
        let url = `/api/donors/${id}/verify?status=${status}`;
        if (healthStatus) url += `&healthStatus=${encodeURIComponent(healthStatus)}`;
        if (hemoglobin !== undefined && hemoglobin !== null) url += `&hemoglobin=${hemoglobin}`;
        if (rejectionReason) url += `&rejectionReason=${encodeURIComponent(rejectionReason)}`;

        const res = await fetchWithAuth(url, {
            method: 'PUT'
        });
        if (res.ok) loadAllData();
        return res;
    };

    const updateDonorDetails = async (id, donorUpdates) => {
        const res = await fetchWithAuth(`/api/donors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(donorUpdates)
        });
        if (res.ok) loadAllData();
        return res;
    };

    const updateTestResult = async (bloodBagId, testData) => {
        const res = await fetchWithAuth(`/api/inventory/bloodbag/${bloodBagId}/test`, {
            method: 'PUT',
            body: JSON.stringify(testData)
        });
        if (res.ok) loadAllData();
    };

    const createUser = async (userData) => {
        const response = await fetch(`${GATEWAY_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response;
    };

    const discardBloodBag = async (bagId) => {
        const res = await fetchWithAuth(`/api/inventory/bloodbag/${bagId}/issue`, {
            method: 'PUT'
        });
        if (res.ok) loadAllData();
    };

    const approveBloodBag = async (bagId) => {
        const res = await fetchWithAuth(`/api/inventory/bloodbag/${bagId}/approve`, {
            method: 'PUT'
        });
        if (res.ok) {
            loadAllData();
            return true;
        }
        return false;
    };

    const addCamp = async (camp) => {
        const res = await fetchWithAuth('/api/camps', {
            method: 'POST',
            body: JSON.stringify(camp)
        });
        if (res.ok) loadAllData();
        return res;
    };

    const deleteCamp = async (id) => {
        const res = await fetchWithAuth(`/api/camps/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) loadAllData();
    };

    const updateCamp = async (id, camp) => {
        const res = await fetchWithAuth(`/api/camps/${id}`, {
            method: 'PUT',
            body: JSON.stringify(camp)
        });
        if (res.ok) loadAllData();
    };

    return (
        <DataContext.Provider value={{
            inventory,
            hospitalRequests,
            bloodTests,
            camps,
            donors,
            loading,
            loadAllData,
            addRequest,
            cancelRequest,
            updateRequestStatus,
            addInventory,
            deleteInventory,
            updateInventory,
            updateTestResult,
            verifyDonor,
            updateDonorDetails,
            createUser,
            discardBloodBag,
            approveBloodBag,
            addCamp,
            deleteCamp,
            updateCamp
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
