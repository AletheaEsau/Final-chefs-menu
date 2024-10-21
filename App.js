import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();

// Function to calculate the average price of menu items by course
const calculateAveragePrice = (menuItems, course) => {
  const itemsByCourse = menuItems.filter(item => item.course === course);
  const total = itemsByCourse.reduce((sum, item) => sum + parseFloat(item.price), 0);
  return itemsByCourse.length ? (total / itemsByCourse.length).toFixed(2) : 0;
};

// Custom Button Component for styling
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Home Screen
function HomeScreen({ navigation, route }) {
  const menuItems = route.params?.menuItems || [];

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://th.bing.com/th/id/OIP.VRt7CBwBYh7W98PTokvtJgHaFn?rs=1&pid=ImgDetMain' }} 
        style={styles.logo} 
      />
      <Text style={styles.header}>Chef's Menu</Text>
      <Text>Total Menu Items: {menuItems.length}</Text>
      
      {/* Display the average prices for each course */}
      <Text>Average Price for Starters: R{calculateAveragePrice(menuItems, 'Starters')}</Text>
      <Text>Average Price for Mains: R{calculateAveragePrice(menuItems, 'Mains')}</Text>
      <Text>Average Price for Dessert: R{calculateAveragePrice(menuItems, 'Dessert')}</Text>

      {/* Display the full menu */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />

      <CustomButton title="Add/Remove Menu Items" onPress={() => navigation.navigate('ManageMenu', { menuItems })} />
      <CustomButton title="Filter Menu by Course" onPress={() => navigation.navigate('FilterMenu', { menuItems })} />
    </View>
  );
}

// Screen to add and remove menu items
function ManageMenuScreen({ navigation, route }) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState(route.params?.menuItems || []);

  const courses = ['Starters', 'Mains', 'Dessert'];

  const addMenuItem = () => {
    if (dishName && description && price) {
      const newItem = {
        id: Math.random().toString(),
        dishName,
        description,
        course,
        price,
      };
      setMenuItems([...menuItems, newItem]);
      setDishName('');
      setDescription('');
      setPrice('');
    } else {
      alert('Please fill all fields.');
    }
  };

  const removeMenuItem = (id) => {
    const updatedMenuItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedMenuItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Menu Items</Text>

      {/* Input fields for new menu item */}
      <TextInput style={styles.input} placeholder="Dish Name" value={dishName} onChangeText={setDishName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Select Course</Text>
      <Picker selectedValue={course} style={styles.picker} onValueChange={setCourse}>
        {courses.map(item => <Picker.Item key={item} label={item} value={item} />)}
      </Picker>
      <TextInput style={styles.input} placeholder="Price (in ZAR)" value={price} onChangeText={setPrice} keyboardType="numeric" />

      <CustomButton title="Add Menu Item" onPress={addMenuItem} />

      {/* List of added menu items with remove functionality */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <CustomButton title="Go Back" onPress={() => navigation.navigate('Home', { menuItems })} />
    </View>
  );
}

// Screen to filter menu items by course
function FilterMenuScreen({ route }) {
  const menuItems = route.params?.menuItems || [];
  const [selectedCourse, setSelectedCourse] = useState('Starters');

  const filteredItems = menuItems.filter(item => item.course === selectedCourse);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filter Menu by Course</Text>

      {/* Picker to select course for filtering */}
      <Picker selectedValue={selectedCourse} style={styles.picker} onValueChange={setSelectedCourse}>
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      {/* Display filtered menu items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ManageMenu" component={ManageMenuScreen} />
        <Stack.Screen name="FilterMenu" component={FilterMenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF', // Light background color
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', // Dark text color
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    color: '#666', // Slightly lighter text for labels
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5, // Rounded input fields
    backgroundColor: '#FFF', // White input background
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  menuItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFF', // White background for menu items
  },
  menuText: {
    fontWeight: 'bold',
    color: '#333', // Dark text for menu items
  },
  removeButton: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#000', // Black buttons
    padding: 10,
    borderRadius: 10, // Rounded corners for buttons
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFF', // White text for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});
