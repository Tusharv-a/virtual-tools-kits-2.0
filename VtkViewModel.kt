
package com.vtk.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class Screen {
    object Dashboard : Screen()
    object Battery : Screen()
    object Network : Screen()
    object Sensors : Screen()
    object Diagnostics : Screen()
}

data class VtkState(
    val currentScreen: Screen = Screen.Network, // Navigated to Network by default
    val batteryLevel: Int = 85,
    val isCharging: Boolean = false,
    val currentMA: Int = 450,
    val cpuUsage: Float = 0.12f,
    val memoryUsedGb: Float = 4.2f,
    val thermalTemp: Float = 32.5f,
    val networkType: String = "5G",
    val networkOperator: String = "Verizon Wireless",
    val signalStrength: Int = -85,
    val localIp: String = "192.168.1.104",
    val ssid: String = "VTK_Secure_5G",
    val showNetworkDialog: Boolean = false
)

class VtkViewModel : ViewModel() {
    private val _state = MutableStateFlow(VtkState())
    val state = _state.asStateFlow()

    init {
        startRealTimeMonitoring()
        // Trigger dialog on startup as requested previously
        triggerNetworkDialog()
    }

    private fun startRealTimeMonitoring() {
        viewModelScope.launch {
            while (true) {
                _state.value = _state.value.copy(
                    cpuUsage = (10..30).random() / 100f,
                    currentMA = (400..500).random()
                )
                delay(2000)
            }
        }
    }

    fun navigateTo(screen: Screen) {
        _state.value = _state.value.copy(currentScreen = screen)
    }

    fun triggerNetworkDialog() {
        viewModelScope.launch {
            _state.value = _state.value.copy(showNetworkDialog = true)
            delay(3500)
            _state.value = _state.value.copy(showNetworkDialog = false)
        }
    }

    fun dismissNetworkDialog() {
        _state.value = _state.value.copy(showNetworkDialog = false)
    }
}
