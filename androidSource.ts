
import { AndroidFile } from '../types';

export const androidSource: AndroidFile[] = [
  {
    name: 'DeviceLog.kt',
    language: 'kotlin',
    path: 'app/src/main/java/com/vtk/data/local/entities/DeviceLog.kt',
    content: `package com.vtk.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room Entity representing a local diagnostic record.
 * This is the primary source of truth for the offline-first architecture.
 */
@Entity(tableName = "device_logs")
data class DeviceLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long = System.currentTimeMillis(),
    val type: String,
    val value: String,
    val isSynced: Boolean = false
)`
  },
  {
    name: 'LogDao.kt',
    language: 'kotlin',
    path: 'app/src/main/java/com/vtk/data/local/dao/LogDao.kt',
    content: `package com.vtk.data.local.dao

import androidx.room.*
import com.vtk.data.local.entities.DeviceLog
import kotlinx.coroutines.flow.Flow

@Dao
interface LogDao {
    @Query("SELECT * FROM device_logs ORDER BY timestamp DESC")
    fun getAllLogs(): Flow<List<DeviceLog>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: DeviceLog)

    @Query("SELECT * FROM device_logs WHERE isSynced = 0")
    suspend fun getUnsyncedLogs(): List<DeviceLog>

    @Update
    suspend fun updateLogs(logs: List<DeviceLog>)
}`
  },
  {
    name: 'VtkRepository.kt',
    language: 'kotlin',
    path: 'app/src/main/java/com/vtk/data/repository/VtkRepository.kt',
    content: `package com.vtk.data.repository

import com.vtk.data.local.dao.LogDao
import com.vtk.data.local.entities.DeviceLog
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

/**
 * Repository Pattern: Manages data operations between Local DB and remote API.
 */
class VtkRepository @Inject constructor(
    private val logDao: LogDao
) {
    // Expose local data as a Flow for real-time UI updates
    val allLogs: Flow<List<DeviceLog>> = logDao.getAllLogs()

    suspend fun saveDiagnostic(type: String, value: String) {
        val newLog = DeviceLog(type = type, value = value)
        logDao.insertLog(newLog)
    }

    suspend fun getPendingSyncData(): List<DeviceLog> {
        return logDao.getUnsyncedLogs()
    }
}`
  },
  {
    name: 'SyncWorker.kt',
    language: 'kotlin',
    path: 'app/src/main/java/com/vtk/worker/SyncWorker.kt',
    content: `package com.vtk.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.vtk.data.repository.VtkRepository

/**
 * WorkManager implementation for offline background synchronization.
 */
class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters,
    private val repository: VtkRepository
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            val pending = repository.getPendingSyncData()
            if (pending.isNotEmpty()) {
                // Perform network sync here...
                // val result = api.sync(pending)
            }
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}`
  },
  {
    name: 'HistoryScreen.kt',
    language: 'kotlin',
    path: 'app/src/main/java/com/vtk/ui/screens/HistoryScreen.kt',
    content: `package com.vtk.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.vtk.viewmodel.VtkViewModel

@Composable
fun HistoryScreen(viewModel: VtkViewModel) {
    // Flow-to-State collection for Compose
    val logs by viewModel.historyLogs.collectAsState(initial = emptyList())

    Scaffold(
        topBar = { TopAppBar(title = { Text("Local Diagnostic History") }) }
    ) { padding ->
        LazyColumn(contentPadding = padding) {
            items(logs) { log ->
                ListItem(
                    headlineContent = { Text(log.type) },
                    supportingContent = { Text(log.value) },
                    trailingContent = { 
                        if (log.isSynced) Icon(Icons.Default.CloudDone, null)
                        else Icon(Icons.Default.CloudOff, null)
                    }
                )
                Divider()
            }
        }
    }
}`
  }
];
