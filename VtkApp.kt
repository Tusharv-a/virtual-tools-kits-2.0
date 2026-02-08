
package com.vtk.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BatteryChargingFull
import androidx.compose.material.icons.filled.CellTower
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.MonitorHeart
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.vtk.ui.components.NetworkStatusDialog
import com.vtk.ui.screens.BatteryScreen
import com.vtk.ui.screens.NetworkScreen
import com.vtk.viewmodel.Screen
import com.vtk.viewmodel.VtkViewModel

@Composable
fun VtkApp(
    modifier: Modifier = Modifier,
    viewModel: VtkViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = state.currentScreen is Screen.Dashboard,
                    onClick = { viewModel.navigateTo(Screen.Dashboard) },
                    icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = state.currentScreen is Screen.Battery,
                    onClick = { viewModel.navigateTo(Screen.Battery) },
                    icon = { Icon(Icons.Default.BatteryChargingFull, contentDescription = "Battery") },
                    label = { Text("Battery") }
                )
                NavigationBarItem(
                    selected = state.currentScreen is Screen.Network,
                    onClick = { viewModel.navigateTo(Screen.Network) },
                    icon = { Icon(Icons.Default.CellTower, contentDescription = "Network") },
                    label = { Text("Network") }
                )
                NavigationBarItem(
                    selected = state.currentScreen is Screen.Diagnostics,
                    onClick = { viewModel.navigateTo(Screen.Diagnostics) },
                    icon = { Icon(Icons.Default.MonitorHeart, contentDescription = "Diagnostics") },
                    label = { Text("Test") }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = modifier.fillMaxSize().padding(innerPadding)) {
            // Screen Content Navigation
            when (state.currentScreen) {
                is Screen.Battery -> BatteryScreen(state = state)
                is Screen.Network -> NetworkScreen(state = state)
                else -> {
                    // Default to Network for this request
                    NetworkScreen(state = state)
                }
            }

            // Briefly appearing Network Status Dialog
            AnimatedVisibility(
                visible = state.showNetworkDialog,
                enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 16.dp, start = 16.dp, end = 16.dp)
            ) {
                NetworkStatusDialog(state = state)
            }
        }
    }
}
