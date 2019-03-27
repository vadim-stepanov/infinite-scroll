import React from 'react'
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Dimensions,
	ActivityIndicator,
	Image,
	TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: [],
			loading: true,
			refreshing: false,
		}

		this._page = 1
	}

	componentDidMount() {
		this._fetchData()
	}

	_fetchData = () => {
		const URL = `https://api.punkapi.com/v2/beers?page=${
			this._page
		}&per_page=10`

		fetch(URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.status != 200) {
					throw new Error(response.status)
				}
				return response.json()
			})
			.then(data => {
				this.setState({
					data: this._page === 1 ? data : [...this.state.data, ...data],
					loading: false,
					refreshing: false,
				})
			})
			.catch(error => {
				console.log('error', error.message)
				this.setState({ loading: false })
			})
	}

	_handleRefresh = () => {
		this._page = 1
		this.setState({ refreshing: true }, () => {
			this._fetchData()
		})
	}

	_handleLoadMore = () => {
		this._page += 1
		this._fetchData()
	}

	_renderFooter = () => {
		return (
			<View style={styles.listFooter}>
				<ActivityIndicator animating size="large" />
			</View>
		)
	}

	_renderHeader = () => {
		return (
			<View style={styles.listHeader}>
				<Image
					resizeMode="contain"
					source={require('./assets/beer.jpg')}
					style={styles.listHeaderImage}
				/>
			</View>
		)
	}

	_renderItem = ({ item }) => {
		return (
			<View style={styles.item}>
				<View style={styles.itemImageWrapper}>
					<Image
						style={styles.itemImage}
						resizeMode="contain"
						source={{ uri: item.image_url }}
					/>
				</View>
				<Text numberOfLines={2} style={styles.itemText}>
					{item.name}
				</Text>
			</View>
		)
	}

	_scrollTotop = () => {
		this._listRef.scrollToOffset({ animated: true, offset: 0 })
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Items: {this.state.data.length}</Text>
					<View style={styles.headerButton}>
						<TouchableOpacity onPress={this._scrollTotop}>
							<Ionicons name="md-arrow-up" size={32} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
				{this.state.loading ? (
					<View>
						<Text style={{ alignSelf: 'center' }}>Loading...</Text>
						<ActivityIndicator />
					</View>
				) : (
					<FlatList
						ref={ref => {
							this._listRef = ref
						}}
						contentContainerStyle={{
							paddingHorizontal: 20,
							alignItems: 'center',
						}}
						numColumns={2}
						data={this.state.data}
						renderItem={item => this._renderItem(item)}
						keyExtractor={item => item.id.toString()}
						ListHeaderComponent={this._renderHeader}
						ListFooterComponent={this._renderFooter}
						onRefresh={this._handleRefresh}
						refreshing={this.state.refreshing}
						onEndReached={this._handleLoadMore}
						onEndReachedThreshold={0.5}
						initialNumToRender={10}
					/>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		width: '100%',
		backgroundColor: '#1E90FF',
	},
	headerText: {
		marginTop: 20,
		color: '#fff',
	},
	headerButton: {
		position: 'absolute',
		right: 10,
		top: 24,
	},
	listHeader: {
		width: width,
		height: 250,
		alignItems: 'center',
		marginTop: 20,
	},
	listHeaderImage: {
		height: '100%',
	},
	listFooter: {
		width: width,
		height: 100,
		justifyContent: 'center',
	},
	item: {
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'column',
		marginTop: 25,
		width: width / 2 - 30,
		height: 250,
		backgroundColor: '#F0F8FF',
		marginHorizontal: 10,
	},
	itemImageWrapper: {
		width: '100%',
		height: 150,
	},
	itemImage: {
		height: '100%',
	},
	itemText: {
		color: '#000',
		textAlign: 'center',
	},
})
